"use client";
import React from "react";
import type { KulinerItem } from "../data/kulinerData";

type Props = { data: KulinerItem[] };

export default function KulinerStats({ data }: Props) {
  const total = data.length;
  const avg = (data.reduce((s, i) => s + (i.rating || 0), 0) / Math.max(1, total)).toFixed(1);
  const kecamatan = new Set(data.map((d) => d.lokasi)).size;

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-white rounded-xl shadow">
        <div className="text-sm text-gray-500">🍽️ Tempat Kuliner</div>
        <div className="font-bold text-2xl">{total}+</div>
      </div>
      <div className="p-4 bg-white rounded-xl shadow">
        <div className="text-sm text-gray-500">⭐ Rata-rata Rating</div>
        <div className="font-bold text-2xl">{avg}</div>
      </div>
      <div className="p-4 bg-white rounded-xl shadow">
        <div className="text-sm text-gray-500">📍 Kecamatan</div>
        <div className="font-bold text-2xl">{kecamatan}</div>
      </div>
    </div>
  );
}
