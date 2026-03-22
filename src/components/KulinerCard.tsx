"use client";
import React, { useState } from "react";
import type { KulinerItem } from "../data/kulinerData";
import { Heart, MapPin, Clock, TrendingUp } from "lucide-react";

type Props = {
  item: KulinerItem;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
};

export default function KulinerCard({ item, isFavorite, onToggleFavorite }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={item.foto}
          alt={item.nama}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white bg-opacity-95 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
          <span className="text-sm font-bold text-gray-800">{item.rating.toFixed(1)}</span>
          <span className="text-yellow-500">★</span>
        </div>

        {/* Favorite Button */}
        <button
          aria-label="save-favorite"
          onClick={() => onToggleFavorite(item.id)}
          className="absolute top-3 left-3 p-2 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 transition-all shadow-md"
        >
          <Heart
            size={20}
            className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
      </div>

      {/* Content Container */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Title & Location */}
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{item.nama}</h3>
          <div className="flex items-center gap-1 mt-1 text-gray-600">
            <MapPin size={14} />
            <span className="text-sm">{item.lokasi}</span>
          </div>
        </div>

        {/* Meta Info */}
        <div className="space-y-2 mb-3 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            <span>{item.jamBuka}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-gray-500" />
            <span className="font-semibold text-gray-900">{item.harga}</span>
          </div>
        </div>

        {/* Menu Favorit */}
        <div className="mb-3 pb-3 border-b border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Menu Populer</p>
          <p className="text-sm font-medium text-gray-800 mt-1">{item.menuFavorit}</p>
        </div>

        {/* Reviews */}
        {item.reviews && item.reviews.length > 0 && (
          <div className="mt-auto pt-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Review Pelanggan</p>
            {item.reviews.slice(0, 1).map((r, i) => (
              <div key={i} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-yellow-500 text-sm font-semibold">{r.rating}</span>
                  <span>★</span>
                </div>
                <p className="text-sm text-gray-700 italic">"{r.komentar}"</p>
                <p className="text-xs text-gray-500 mt-1">— {r.user}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Button */}
      <div className="px-4 pb-4 mt-auto">
        <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-sm hover:shadow-lg transition-all">
          Lihat Detail & Lokasi
        </button>
      </div>
    </div>
  );
}
