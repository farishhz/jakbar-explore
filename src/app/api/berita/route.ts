import { NextResponse } from 'next/server';
import { load } from 'cheerio';
import Redis from 'ioredis';

type BeritaItem = {
  judul: string;
  link?: string;
  gambar?: string | null;
  tanggal?: string | null;
  ringkasan?: string | null;
};

// Simple in-memory cache (module scope). Works for long-running server processes.
// In-memory cache map keyed by "pages" value so different requests can be cached separately.
const cacheMap: Map<string, { ts: number; data: BeritaItem[] }> = new Map();
const DEFAULT_PAGES = 10;
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

// Optional Redis client if REDIS_URL is provided
let redis: Redis | null = null;
const REDIS_KEY = 'kabar_jakbar:berita_list';
const REDIS_TTL = 60 * 10; // seconds
if (process.env.REDIS_URL) {
  try {
    redis = new Redis(process.env.REDIS_URL);
  } catch (e) {
    // ignore redis init errors; we'll fall back to in-memory cache
    redis = null;
  }
}

async function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function fetchWithRetries(url: string, maxRetries = 3, baseDelay = 500) {
  let lastError: any = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      lastError = err;
      const delay = baseDelay * Math.pow(2, attempt);
      await sleep(delay);
    }
  }
  throw lastError;
}

export async function GET(request: Request) {
  const target = 'https://barat.jakarta.go.id/berita';

  // Read pages param from query string
  const reqUrl = new URL(request.url);
  const pagesParam = Number(reqUrl.searchParams.get('pages') || DEFAULT_PAGES);
  const pages = Number.isFinite(pagesParam) && pagesParam > 0 ? Math.min(20, Math.floor(pagesParam)) : DEFAULT_PAGES;

  const cacheKey = String(pages);

    // Try Redis first (if available) for this pages key
  if (redis) {
    try {
      const raw = await redis.get(`${REDIS_KEY}:${cacheKey}`);
      if (raw) {
        const parsed = JSON.parse(raw) as { ts: number; data: BeritaItem[] };
        if (Date.now() - parsed.ts < CACHE_TTL) {
          // populate in-memory cache as well
          cacheMap.set(cacheKey, parsed);
          return NextResponse.json({ success: true, data: parsed.data, cached: true, source: 'redis' });
        }
      }
    } catch (e) {
      // ignore redis read errors
    }
  }

  // Return cached if fresh (in-memory)
  const now = Date.now();
  const existing = cacheMap.get(cacheKey);
  if (existing && now - existing.ts < CACHE_TTL) {
    return NextResponse.json({ success: true, data: existing.data, cached: true, source: 'memory' });
  }

  try {
    const beritaList: BeritaItem[] = [];
    const seen = new Set<string>();

    for (let p = 1; p <= pages; p++) {
      // Try common pagination query param; many CMS use ?page=2
      const pageUrl = `${target}?page=${p}`;
      let pageHtml: string | null = null;
      try {
        pageHtml = await fetchWithRetries(pageUrl, 2, 300);
      } catch (e) {
        // try path-style pagination as fallback
        try {
          pageHtml = await fetchWithRetries(`${target}/page/${p}`, 2, 300);
        } catch (e2) {
          // give up this page
          continue;
        }
      }

      if (!pageHtml) continue;
      const $ = load(pageHtml);

      // Primary selectors
      $(
        '.views-row, .item-berita, .card, .node, article, .news-item, .post, .teaser, .list-item'
      ).each((i, el) => {
        const el$ = $(el);
        const titleEl = el$.find('h3 a, h2 a, .title a, .field--name-title a, a').first();
        let judul = titleEl.text().trim();
        let link = titleEl.attr('href') || '';
        if (!judul && link) judul = (link.split('/').pop() || '').replace(/[-_]/g, ' ');

        if (link && !link.startsWith('http')) {
          try {
            link = new URL(link, 'https://barat.jakarta.go.id').toString();
          } catch {}
        }

        const key = (link || judul).trim();
        if (!key) return;
        if (seen.has(key)) return;
        seen.add(key);

        // try multiple common image attributes (lazy loaders, srcset)
        let gambar: string | null = null;
        const img = el$.find('img').first();
        if (img && img.length > 0) {
          gambar = img.attr('src') || img.attr('data-src') || img.attr('data-original') || img.attr('data-lazy') || null;
          if (!gambar) {
            const srcset = img.attr('srcset') || img.attr('data-srcset') || '';
            if (srcset) {
              // take the first url from srcset
              const first = srcset.split(',')[0].trim().split(' ')[0];
              if (first) gambar = first;
            }
          }
        }
        const tanggal = el$.find('time, .date, .created, .field--name-field-tanggal').text().trim() || null;
        const ringkasan = el$.find('.excerpt, .summary, .field--name-body, p').first().text().trim() || null;

        beritaList.push({ judul, link, gambar, tanggal, ringkasan });
      });

      // Fallback: find anchors that look like article links and extract nearby context
      $('a[href*="/berita/"]').each((i, a) => {
        const a$ = $(a);
        let raw = a$.attr('href') || '';
        if (!raw) return;

        // Resolve relative links
        if (!raw.startsWith('http')) {
          try {
            raw = new URL(raw, 'https://barat.jakarta.go.id').toString();
          } catch {}
        }

        // Ignore common social/share hosts or links that are not direct barat.jakarta.go.id article links
        try {
          const u = new URL(raw);
          const host = u.hostname.replace(/^www\./, '');
          if (host !== 'barat.jakarta.go.id') {
            return; // skip non-site links (share buttons, external)
          }
          // only accept paths that start with /berita
          if (!u.pathname.startsWith('/berita')) return;
        } catch (e) {
          return;
        }

        const link = raw;
        const judul = (a$.text() || '').trim();
        const key = (link || judul).trim();
        if (!key) return;
        if (seen.has(key)) return;

        // try to locate parent container for image/excerpt
        const parent = a$.closest('article, .views-row, .item-berita, .node, .card, .post, .teaser, .news-item');
        // parent image detection with same lazy attribute checks
        let gambar = null;
        const pimg = parent.find('img').first();
        if (pimg && pimg.length > 0) {
          gambar = pimg.attr('src') || pimg.attr('data-src') || pimg.attr('data-original') || pimg.attr('data-lazy') || null;
          if (!gambar) {
            const srcset = pimg.attr('srcset') || pimg.attr('data-srcset') || '';
            if (srcset) {
              const first = srcset.split(',')[0].trim().split(' ')[0];
              if (first) gambar = first;
            }
          }
        }
        const tanggal = parent.find('time, .date, .created, .field--name-field-tanggal').text().trim() || null;
        const ringkasan = parent.find('.excerpt, .summary, p').first().text().trim() || null;
        seen.add(key);
        beritaList.push({ judul: judul || (link.split('/').pop() || ''), link, gambar, tanggal, ringkasan });
      });

      // small delay to be polite
      await sleep(200);
    }

    // Update cache map
    const payload = { ts: Date.now(), data: beritaList };
    cacheMap.set(cacheKey, payload);

    // For items missing gambar, attempt to fetch the article page to extract an og:image or first image.
    // Limit rate so we don't hammer the source site.
    const missing = beritaList.filter((b) => (!b.gambar || b.gambar === null) && b.link);
    for (let i = 0; i < missing.length; i++) {
      const it = missing[i];
      try {
        const articleHtml = await fetchWithRetries(it.link!, 2, 300);
        const $$ = load(articleHtml);
        let found = $$('meta[property="og:image"]').attr('content') || $$('meta[name="twitter:image"]').attr('content') || null;
        if (!found) {
          const aim = $$('article img, .field--name-field-image img, .lead img, .thumbnail img').first();
          if (aim && aim.length > 0) {
            found = aim.attr('src') || aim.attr('data-src') || aim.attr('data-lazy') || null;
          }
        }
        if (found) {
          if (found && !found.startsWith('http')) {
            try { found = new URL(found, it.link).toString(); } catch {}
          }
          it.gambar = found;
        }
      } catch (e) {
        // ignore per-article fetch errors
      }
      // polite delay
      await sleep(150);
    }
    // Try to persist to Redis if available
    if (redis) {
      try {
        await redis.set(`${REDIS_KEY}:${cacheKey}`, JSON.stringify(payload), 'EX', REDIS_TTL);
      } catch (e) {
        // ignore redis write failure
      }
    }

    return NextResponse.json({ success: true, data: beritaList, cached: false });
  } catch (err: any) {
    // If we have stale in-memory cache, return it with warning
    if (existing) {
      return NextResponse.json({ success: true, data: existing.data, cached: true, warning: 'Returned stale cache due to fetch error', error: String(err) });
    }
    // Try returning redis stale value if available
    if (redis) {
      try {
        const raw = await redis.get(`${REDIS_KEY}:${cacheKey}`);
        if (raw) {
          const parsed = JSON.parse(raw) as { ts: number; data: BeritaItem[] };
          return NextResponse.json({ success: true, data: parsed.data, cached: true, source: 'redis-stale', warning: 'Returned stale redis cache due to fetch error', error: String(err) });
        }
      } catch (e) {
        // ignore
      }
    }
    return NextResponse.json({ success: false, message: err?.message || String(err) }, { status: 500 });
  }
}
