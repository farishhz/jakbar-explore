"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

type Item = {
  judul: string;
  link?: string;
  gambar?: string | null;
  tanggal?: string | null;
  ringkasan?: string | null;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function BeritaDetailPage() {
  const params = useParams();
  const slug = (params && (params as any).slug) || '';
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [contentHtml, setContentHtml] = useState<string | null>(null);
  const [detailImage, setDetailImage] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const fetchDetail = async (url: string) => {
    try {
      setDetailLoading(true);
      setDetailError(null);
      const res = await fetch('/api/berita/detail?url=' + encodeURIComponent(url));
      const json = await res.json();
      if (!json.success) {
        setDetailError(json.message || 'Gagal memuat detail');
        return;
      }
      const d = json.data || {};
      if (d.contentHtml) {
        setContentHtml(d.contentHtml);
      }
      if (d.image) setDetailImage(d.image);
      if (d.author) setAuthor(d.author);
      if (d.category) setCategory(d.category);
      if (d.title) {
        // Optionally update item title if missing
        setItem((prev) => (prev ? { ...prev, judul: d.title } : prev));
      }
      if (d.date) {
        setItem((prev) => (prev ? { ...prev, tanggal: d.date } : prev));
      }
      // cache detail in localStorage
      try {
        const key = 'berita_detail_' + slug;
        localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data: d }));
      } catch {}

      // If server returned a cached result but content is too short, request a fresh scrape
      if (json.cached && (!d.contentHtml || (d.contentHtml && d.contentHtml.length < 200))) {
        try {
          const fres = await fetch('/api/berita/detail?url=' + encodeURIComponent(url) + '&bust=1');
          const fj = await fres.json();
          if (fj.success && fj.data) {
            const nd = fj.data;
            if (nd.contentHtml) setContentHtml(nd.contentHtml);
            if (nd.image) setDetailImage(nd.image);
            if (nd.author) setAuthor(nd.author);
            if (nd.category) setCategory(nd.category);
            try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data: nd })); } catch {}
          }
        } catch (e) {
          // ignore second-fetch errors
        }
      }
    } catch (e: any) {
      setDetailError(String(e));
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    const cacheKey = 'berita_cache_v1';
    const cachedRaw = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null;
    if (cachedRaw) {
      try {
        const parsed = JSON.parse(cachedRaw) as { ts: number; data: Item[] };
        const found = parsed.data.find((d) => slugify(d.judul) === slug);
        if (found) {
          setItem(found);
          setLoading(false);
          // fetch detail content
          if (found.link) fetchDetail(found.link);
          return;
        }
      } catch (e) {
        // ignore
      }
    }

    fetch('/api/berita')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          const data: Item[] = res.data || [];
          try {
            localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data }));
          } catch (e) {}
          const found = data.find((d) => slugify(d.judul) === slug);
          if (found) {
            setItem(found);
            if (found.link) fetchDetail(found.link);
          }
          else setError('Artikel tidak ditemukan');
        } else {
          setError(res.message || 'Gagal mengambil data');
        }
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center">
      <button onClick={() => window.history.back()} className="absolute top-6 left-6 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors">
        <ChevronLeft className="h-5 w-5" />
        Kembali
      </button>
      <div className="text-slate-600">Loading...</div>
    </div>
  );
  if (error) return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center">
      <button onClick={() => window.history.back()} className="absolute top-6 left-6 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors">
        <ChevronLeft className="h-5 w-5" />
        Kembali
      </button>
      <div className="text-red-600">Error: {error}</div>
    </div>
  );
  if (!item) return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center">
      <button onClick={() => window.history.back()} className="absolute top-6 left-6 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors">
        <ChevronLeft className="h-5 w-5" />
        Kembali
      </button>
      <div className="text-slate-600">Artikel tidak ditemukan.</div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      {/* Hero Image */}
      {(detailImage || item.gambar) && (
        <div className="relative h-96 bg-slate-200 overflow-hidden">
          <img 
            src={detailImage || item.gambar || ''} 
            alt={item.judul} 
            className="w-full h-full object-cover" 
            loading="eager" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}
      
      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-4">
          <button onClick={() => history.back()} className="text-sm text-orange-600 hover:text-orange-700 hover:underline font-medium flex items-center gap-1 transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Kembali
          </button>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 flex-wrap mb-4">
            {category && <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">{category}</span>}
            {author && <span className="text-xs text-slate-600 font-medium">Oleh {author}</span>}
            {item.tanggal && <span className="text-xs text-slate-500">{item.tanggal}</span>}
          </div>
          <h1 className="text-4xl font-bold text-slate-900 leading-tight mb-2">{item.judul}</h1>
        </div>

        {(detailLoading && !contentHtml) && <div className="mb-4 text-slate-600 flex items-center gap-2"><span className="animate-spin">↻</span> Memuat isi artikel...</div>}
        {detailError && <div className="text-red-600 mb-4 p-3 bg-red-50 rounded-lg text-sm">⚠ {detailError}</div>}

        {/* Article Content */}
        {contentHtml ? (
          <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        ) : (
          <>
            <p className="text-slate-700 mb-6 leading-relaxed">{item.ringkasan}</p>
            {item.link && (
              <p className="mt-6">
                <a href={item.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold hover:underline">
                  Baca di sumber asli 
                  <span>→</span>
                </a>
              </p>
            )}
          </>
        )}

        {/* Related Articles */}
        <section className="mt-12 pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Artikel Terkait</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {getRelatedItems(item).map((rel, i) => (
              <a key={i} href={`/berita/${slugify(rel.judul)}`} className="group p-4 border border-slate-200 rounded-lg hover:border-orange-400 hover:shadow-md transition-all duration-300">
                <div className="text-xs text-orange-600 font-semibold uppercase tracking-wider mb-1">{rel.tanggal || 'Tanpa Tanggal'}</div>
                <h4 className="font-semibold text-slate-900 group-hover:text-orange-600 line-clamp-2 transition-colors">{rel.judul}</h4>
              </a>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}

function getRelatedItems(current: Item | null) {
  try {
    const cachedRaw = typeof window !== 'undefined' ? localStorage.getItem('berita_cache_v1') : null;
    if (!cachedRaw) return [] as Item[];
    const parsed = JSON.parse(cachedRaw) as { ts: number; data: Item[] };
    const items = parsed.data || [];
    if (!current) return items.slice(0, 6);
    const filtered = items.filter((it) => it.judul !== current.judul).slice(0, 6);
    return filtered;
  } catch (e) {
    return [] as Item[];
  }
}

export { };
