"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
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

const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-lg overflow-hidden border border-slate-100">
    <div className="h-48 bg-gradient-to-r from-slate-200 to-slate-100" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-100 rounded w-full" />
      <div className="h-3 bg-slate-100 rounded w-2/3" />
      <div className="h-8 bg-slate-200 rounded w-1/3 mt-4" />
    </div>
  </div>
);

export default function BeritaPage() {
  const [berita, setBerita] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [perPage, setPerPage] = useState(24);
  const [refr, setRefr] = useState(false);

  useEffect(() => {
    let mounted = true;
    const doFetch = (bust = false) => {
      const url = '/api/berita?pages=20' + (bust ? `&bust=${Date.now()}` : '');
      fetch(url)
        .then((r) => r.json())
        .then((data) => {
          if (!mounted) return;
          if (data.success) {
            const items: Item[] = data.data || [];
            setBerita(items);
            try {
              localStorage.setItem('berita_cache_v1', JSON.stringify({ ts: Date.now(), data: items }));
            } catch {}
          } else {
            setError(data.message || 'Gagal mengambil berita');
          }
        })
        .catch((e) => setError(String(e)))
        .finally(() => { if (mounted) { setLoading(false); setRefr(false); } });
    };

    doFetch(false);
    return () => {
      mounted = false;
    };
  }, []);

  function handleRefresh() {
    setRefr(true);
    fetch('/api/berita?pages=20&bust=' + Date.now())
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const items: Item[] = data.data || [];
          setBerita(items);
          try {
            localStorage.setItem('berita_cache_v1', JSON.stringify({ ts: Date.now(), data: items }));
          } catch {}
        } else {
          setError(data.message || 'Gagal mengambil berita');
        }
      })
      .catch((e) => setError(String(e)))
      .finally(() => setRefr(false));
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return berita;
    return berita.filter((b) => (b.judul || '').toLowerCase().includes(q) || (b.ringkasan || '').toLowerCase().includes(q));
  }, [berita, query]);

  const visible = useMemo(() => filtered.slice(0, perPage), [filtered, perPage]);

  if (loading)
    return (
      <div className="p-6 bg-gradient-to-b from-orange-50 to-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-6 transition-colors">
            <ChevronLeft className="h-5 w-5" />
            Kembali
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(12)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  if (error) return (
    <div className="p-12 min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center">
      <button onClick={() => window.history.back()} className="absolute top-6 left-6 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors">
        <ChevronLeft className="h-5 w-5" />
        Kembali
      </button>
      <div className="text-center">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      <header className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-10 shadow-lg relative">
        <button onClick={() => window.history.back()} className="absolute top-4 left-4 flex items-center gap-2 text-white hover:text-orange-100 font-medium transition-colors">
          <ChevronLeft className="h-5 w-5" />
          Kembali
        </button>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Berita Jakarta Barat</h1>
            <p className="text-orange-100 text-lg">Berita terbaru dari Pemerintah Kota Administrasi Jakarta Barat</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sticky top-0 bg-white/80 backdrop-blur-sm p-4 -mx-4 px-4 rounded-b-lg shadow-sm z-10">
          <div className="flex items-center gap-3 w-full sm:w-1/2 group">
            <input
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
              placeholder="Cari judul atau ringkasan..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Cari berita"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 font-medium">Per halaman:</span>
            <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 transition-all duration-300 font-medium text-slate-700 hover:border-orange-400">
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
            <button 
              onClick={handleRefresh} 
              disabled={refr}
              className="ml-3 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <span className={refr ? "animate-spin" : ""}>↻</span>
              {refr ? "Muat..." : "Segarkan"}
            </button>
          </div>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {visible.length > 0 ? (
          visible.map((item, idx) => (
            <article key={idx} className="group bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <Link href={`/berita/${slugify(item.judul)}`} className="block">
                <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-100 overflow-hidden relative">
                  <img
                    src={item.gambar || 'https://via.placeholder.com/800x450?text=No+Image'}
                    alt={item.judul}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
                    loading="lazy"
                    onError={(e: any) => (e.target.src = 'https://via.placeholder.com/800x450?text=No+Image')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
              <div className="p-5">
                <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">{item.tanggal || 'Tanpa Tanggal'}</div>
                <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                  <Link href={`/berita/${slugify(item.judul)}`} className="hover:underline">{item.judul}</Link>
                </h3>
                <p className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed">{item.ringkasan || 'Tap untuk baca artikel lengkap.'}</p>
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                  <Link href={`/berita/${slugify(item.judul)}`} className="text-sm text-orange-600 font-semibold group-hover:text-orange-700 flex items-center gap-1 transition-colors">
                    Baca selengkapnya 
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Link>
                  <a href={item.link || '#'} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Link</a>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="col-span-full text-center text-slate-500 py-12">Tidak ada berita ditemukan.</p>
        )}
      </section>

      {filtered.length > visible.length && (
        <div className="max-w-6xl mx-auto px-4 pb-12 text-center">
          <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:shadow-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 font-semibold" onClick={() => setPerPage((p) => p + 12)}>
            Muat lebih banyak
          </button>
        </div>
      )}

      <footer className="max-w-6xl mx-auto px-4 pb-8 text-sm text-slate-600 text-center">Menampilkan <span className="font-semibold text-slate-900">{visible.length}</span> dari <span className="font-semibold text-slate-900">{filtered.length}</span> berita</footer>
    </main>
  );
}
