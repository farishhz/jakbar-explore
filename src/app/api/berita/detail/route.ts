import { NextResponse } from 'next/server';
import { load } from 'cheerio';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import Redis from 'ioredis';

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

const REDIS_URL = process.env.REDIS_URL || null;
const DETAIL_TTL = 60 * 60 * 24; // 24 hours
let redisClient: Redis | null = null;
if (REDIS_URL) {
  try {
    redisClient = new Redis(REDIS_URL);
  } catch (e) {
    redisClient = null;
  }
}

export async function GET(request: Request) {
  try {
    const reqUrl = new URL(request.url);
    const url = reqUrl.searchParams.get('url');
    if (!url) return NextResponse.json({ success: false, message: 'Missing url parameter' }, { status: 400 });

    // Only allow barat.jakarta.go.id for scraping
    try {
      const parsed = new URL(url);
      if (!parsed.hostname.includes('barat.jakarta.go.id')) {
        return NextResponse.json({ success: false, message: 'Only barat.jakarta.go.id URLs are supported' }, { status: 400 });
      }
    } catch (e) {
      return NextResponse.json({ success: false, message: 'Invalid url' }, { status: 400 });
    }

    // Optionally bypass redis when caller includes ?bust=1
    const bust = reqUrl.searchParams.get('bust');
    const cacheKey = 'kabar_jakbar:berita_detail:' + Buffer.from(url).toString('base64').replace(/=/g, '');
    if (redisClient && !bust) {
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          return NextResponse.json({ success: true, cached: true, data: parsed });
        }
      } catch (e) {
        // ignore redis errors and fall through to scraping
      }
    }

    const html = await fetchWithRetries(url, 3, 400);
    const $ = load(html);

    const title = $('meta[property="og:title"]').attr('content') || $('h1').first().text().trim() || $('title').text().trim();
    const date = $('meta[property="article:published_time"]').attr('content') || $('time').first().text().trim() || $('.date').first().text().trim() || null;

    // Prefer open graph / twitter images, then first article image
    let image = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content') || null;
    if (!image) {
      const imgEl = $('article img, .lead img, .field--name-field-image img, .thumbnail img').first();
      if (imgEl && imgEl.length > 0) {
        image = imgEl.attr('src') || imgEl.attr('data-src') || imgEl.attr('data-lazy') || null;
      }
    }
    if (image && !image.startsWith('http')) {
      try { image = new URL(image, url).toString(); } catch {}
    }

    // Choose best candidate container by text length
    const candidates = [
      '[itemprop="articleBody"]',
      '[role="article"]',
      'article .field--name-body',
      '.inner-box .text-content-berita',
      '.text-content-berita',
      '.text-justify',
      'article .entry-content',
      'article .post-content',
      '.field--name-body',
      '.entry-content',
      '.article-content',
      '.node__content',
      '.detail-body',
      '.content-article',
      'article',
      'main',
      '#content'
    ];

    let contentHtml: string | null = null;
    let bestLen = 0;
    for (const sel of candidates) {
      try {
        const el = $(sel).first();
        if (el && el.length > 0) {
          const textLen = el.text().trim().length;
          const htmlCandidate = el.html() || '';
          if (textLen > bestLen && htmlCandidate.trim().length > 20) {
            bestLen = textLen;
            contentHtml = htmlCandidate;
          }
        }
      } catch (e) {
        // ignore
      }
    }

    // fallback: assemble from headings, first images, paragraphs
    if (!contentHtml || contentHtml.trim().length < 120) {
      // Try explicit site-specific container if present
      try {
        const siteEl = $('.text-content-berita, .inner-box .text-content-berita').first();
        if (siteEl && siteEl.length > 0) {
          const candidate = siteEl.html() || '';
          if (candidate.trim().length > 100) contentHtml = candidate;
        }
      } catch (e) {}

      const parts: string[] = [];
      $('h1,h2,h3').each((i, h) => {
        const t = $(h).text().trim();
        if (t && t.length > 5) parts.push(`<h3>${$(h).html()}</h3>`);
      });
      $('article img, .lead img, .field--name-field-image img, .thumbnail img').each((i, im) => {
        if (i > 2) return;
        const s = $(im).attr('src') || $(im).attr('data-src') || $(im).attr('data-lazy') || '';
        if (s) parts.push(`<p><img src="${s}" /></p>`);
      });
      $('p').each((i, p) => {
        const txt = $(p).text().trim();
        if (txt && txt.length > 20) parts.push(`<p>${$(p).html()}</p>`);
      });
      if (parts.length) contentHtml = parts.join('\n');
    }

    // Normalize images inside content and make absolute
    if (contentHtml) {
      const $$ = load(contentHtml);
      $$('img').each((i, im) => {
        const src = $$(im).attr('src') || $$(im).attr('data-src') || $$(im).attr('data-lazy') || '';
        if (src && !src.startsWith('http')) {
          try { $$(im).attr('src', new URL(src, url).toString()); } catch {}
        }
      });
      contentHtml = $$.html();

      // sanitize
      try {
        const { window } = new JSDOM('');
        const DOMPurify = createDOMPurify(window as any);
        const ALLOWED_TAGS = ['a','p','ul','ol','li','strong','em','b','i','u','br','img','h1','h2','h3','h4','h5','h6','blockquote','figure','figcaption','pre','code'];
        const ALLOWED_ATTR = ['href','src','alt','title','class','width','height','loading','decoding'];

        const sanitized = DOMPurify.sanitize(contentHtml, {
          ALLOWED_TAGS,
          ALLOWED_ATTR,
          ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|data):|\/)/i,
        });

        const $$san = load(sanitized || '');
        $$san('a').each((i, a) => {
          const href = $$(a).attr('href') || '';
          if (href && !href.startsWith('#')) {
            $$(a).attr('target', '_blank');
            $$(a).attr('rel', 'noopener noreferrer nofollow');
          }
        });
        $$san('img').each((i, im) => {
          const src = $$(im).attr('src') || '';
          if (src && !src.startsWith('http')) {
            try { $$(im).attr('src', new URL(src, url).toString()); } catch {}
          }
          $$(im).attr('loading', 'lazy');
          $$(im).attr('decoding', 'async');
          const existing = $$(im).attr('class') || '';
          $$(im).attr('class', (existing + ' max-w-full h-auto').trim());
        });

        contentHtml = $$san.html();
        // strip html/body wrappers
        try {
          const bodyMatch = contentHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
          if (bodyMatch) contentHtml = bodyMatch[1];
          const htmlMatch = contentHtml.match(/<html[^>]*>([\s\S]*?)<\/html>/i);
          if (htmlMatch) contentHtml = htmlMatch[1];
        } catch (e) {}
      } catch (e) {
        // leave unsanitized fallback
      }
    }

    // Ensure we have a main image if possible (try meta again or first image in content)
    if ((!image || image === null) && contentHtml) {
      const $$ = load(contentHtml);
      const first = $$('img').first().attr('src') || null;
      if (first) {
        image = first;
        if (image && !image.startsWith('http')) {
          try { image = new URL(image, url).toString(); } catch {}
        }
      }
    }

    const author = $('meta[name="author"]').attr('content') || $('.author, .byline, .field--name-field-penulis').first().text().trim() || null;
    const category = $('meta[property="article:section"]').attr('content') || $('.category, .tags, .field--name-field-kategori').first().text().trim() || null;

    const result = { title, date, image, contentHtml, author, category, fetchedAt: Date.now() };

    if (redisClient) {
      try {
        await redisClient.set(cacheKey, JSON.stringify(result), 'EX', DETAIL_TTL);
      } catch (e) {
        // ignore
      }
    }

    return NextResponse.json({ success: true, cached: false, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || String(err) }, { status: 500 });
  }
}
