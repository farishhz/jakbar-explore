"use client";
import React from "react";

type Props = {
  active: string[];
  setActive: (c: string[]) => void;
};

const CATEGORIES = [
  { key: "Tradisional", emoji: "🍛" },
  { key: "Street Food", emoji: "🍜" },
  { key: "Cafe & Nongkrong", emoji: "☕" },
  { key: "Seafood", emoji: "🦞" },
  { key: "Murah", emoji: "💸" },
  { key: "Rating Tertinggi", emoji: "⭐" }
];

export default function KulinerFilter({ active, setActive }: Props) {
  const toggle = (k: string) => {
    if (active.includes(k)) setActive(active.filter((a) => a !== k));
    else setActive([...active, k]);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {CATEGORIES.map((c) => {
        const on = active.includes(c.key);
        return (
          <button
            key={c.key}
            onClick={() => toggle(c.key)}
            className={`px-3 py-1 rounded-full border transition ${on ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            <span className="mr-2">{c.emoji}</span>
            <span className="text-sm">{c.key}</span>
          </button>
        );
      })}
    </div>
  );
}
