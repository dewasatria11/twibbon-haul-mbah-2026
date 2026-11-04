"use client";

import React, { useEffect, useState } from "react";

interface ViewStats {
  today: number;
  total: number;
}

export default function VisitorCounter() {
  const [stats, setStats] = useState<ViewStats | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const res = await fetch("/api/views", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data && typeof data.today === "number") {
          setStats({
            today: data.today,
            total: data.total || data.today,
          });
        }
      } catch (err) {
        // Silently fail if network issue
        console.warn("Could not load visitor counter:", err);
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex justify-center px-4 pb-5 pt-3">
      <div
        className="inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-white/90 px-3.5 py-1.5 text-xs text-stone-600 shadow-sm backdrop-blur-sm transition-all hover:border-stone-300 hover:shadow"
        title="Jumlah pengunjung Twibbon Haul KH. Abu Chamid"
      >
        {/* Pulsing Green Indicator */}
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
        </span>

        {/* Counter Text */}
        {stats ? (
          <div className="flex items-center gap-1.5 font-medium">
            <span className="font-bold text-stone-900">
              {stats.today.toLocaleString("id-ID")}
            </span>
            <span className="text-stone-500">visitor counter</span>
            <span className="text-stone-300">•</span>
            <span className="font-semibold text-stone-700">
              {stats.total.toLocaleString("id-ID")}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-stone-400">
            <span className="inline-block h-3 w-5 animate-pulse rounded bg-stone-200" />
            <span>visitor counter</span>
            <span className="text-stone-300">•</span>
            <span className="inline-block h-3 w-7 animate-pulse rounded bg-stone-200" />
          </div>
        )}
      </div>
    </div>
  );
}
