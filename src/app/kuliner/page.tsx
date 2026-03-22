"use client";
import React, { useEffect, useMemo, useState } from "react";
import { kulinerDataExtended as kulinerData } from "../../data/kulinerData";
import KulinerCard from "../../components/KulinerCard";
import KulinerFilter from "../../components/KulinerFilter";
import SkeletonCard from "../../components/SkeletonCard";
import KulinerStats from "../../components/KulinerStats";

export default function Page() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const searchRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const s = localStorage.getItem("kuliner-favs");
    if (s) setFavorites(JSON.parse(s));
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    localStorage.setItem("kuliner-favs", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key.toLowerCase() === "f") {
        setShowFavoritesOnly((s) => !s);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const parseMinPrice = (p?: string) => {
    if (!p) return Infinity;
    const m = p.match(/Rp\s*(\d+)/);
    if (!m) return Infinity;
    return Number(m[1]) / 1000;
  };

  const filtered = useMemo(() => {
    let data = kulinerData.filter((item) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        item.nama.toLowerCase().includes(q) ||
        item.lokasi.toLowerCase().includes(q) ||
        item.menuFavorit.toLowerCase().includes(q);

      const matchesCategory =
        filters.length === 0 ||
        filters.some((f) => {
          if (f === "Murah") {
            return parseMinPrice(item.harga) < 30;
          }
          return item.kategori.includes(f);
        });

      return matchesSearch && matchesCategory;
    });

    if (filters.includes("Rating Tertinggi")) {
      data = data.sort((a, b) => b.rating - a.rating);
    }

    return data;
  }, [search, filters]);

  const displayList = useMemo(() => {
    let list = filtered;
    if (showFavoritesOnly) list = list.filter((i) => favorites.includes(i.id));
    return list;
  }, [filtered, showFavoritesOnly, favorites]);

  const totalPages = Math.max(1, Math.ceil(displayList.length / itemsPerPage));
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = displayList.slice(indexOfFirst, indexOfLast);

  useEffect(() => setCurrentPage(1), [search, filters]);

  const topRecommendation = [...kulinerData].sort((a, b) => b.rating - a.rating)[0];

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-4">Kuliner Jakarta Barat</h1>

      <KulinerStats data={kulinerData} />

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari kuliner, lokasi, menu..."
          ref={searchRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-xl mb-3 bg-card text-card-foreground"
        />

        <KulinerFilter active={filters} setActive={setFilters} />
      </div>

      <div className="mb-6">
        <h2 className="font-semibold text-xl mb-2">🔥 Rekomendasi Hari Ini</h2>
        {topRecommendation && (
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-white rounded-xl shadow">
            <div className="md:flex gap-4">
              <div className="md:w-1/3">
                <img src={topRecommendation.foto} alt={topRecommendation.nama} className="w-full h-48 object-cover rounded-lg" />
              </div>
              <div className="md:flex-1 mt-3 md:mt-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-2xl">{topRecommendation.nama}</h3>
                    <p className="text-sm text-gray-600">{topRecommendation.lokasi}</p>
                  </div>
                  <div className="text-sm">{topRecommendation.rating} ⭐</div>
                </div>
                <p className="mt-2">🔥 Menu favorit: {topRecommendation.menuFavorit}</p>
                <div className="mt-3">
                  <button className="px-3 py-1 bg-red-500 text-white rounded mr-2">🔥 Paling Ramai</button>
                  <button className="px-3 py-1 bg-yellow-400 text-black rounded">👑 Best Seller</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentItems.map((item) => (
              <KulinerCard key={item.id} item={item} isFavorite={favorites.includes(item.id)} onToggleFavorite={toggleFavorite} />
            ))}
          </div>

          <div className="flex justify-center mt-6 gap-2">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded ${currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="mt-8">
        <h2 className="font-semibold text-lg mb-3">Kuliner Favorit Saya</h2>
        {favorites.length === 0 ? (
          <div className="text-gray-500">Belum ada favorit — klik tombol hati pada card untuk menyimpan.</div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {kulinerData.filter((i) => favorites.includes(i.id)).map((item) => (
              <KulinerCard key={item.id} item={item} isFavorite={true} onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
