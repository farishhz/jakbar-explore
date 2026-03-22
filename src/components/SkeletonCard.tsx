"use client";
import React from "react";

export default function SkeletonCard() {
  return (
    <div className="animate-pulse p-4 bg-white rounded-xl shadow">
      <div className="bg-gray-300 h-44 rounded mb-3" />
      <div className="h-4 bg-gray-300 w-3/4 rounded mb-2" />
      <div className="h-4 bg-gray-300 w-1/2 rounded" />
    </div>
  );
}
