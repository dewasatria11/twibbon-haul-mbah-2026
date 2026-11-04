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
    <div className="flex justify-center pb-2.5">
      <div
        className="inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-white/95 px-3 py-1 text-[11px] sm:text-xs text-stone-600 shadow-sm backdrop-blur-sm transition-all hover:border-stone-300"
        title="Total pengunjung website Twibbon Haul KH. Abu Chamid"
      >
        {/* Pulsing Green Indicator */}
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
        </span>

        {/* Counter Text: only cumulative total + visitor counter */}
        {stats ? (
          <div className="flex items-center gap-1.5 font-medium">
            <span className="font-bold text-stone-900">
              {stats.total.toLocaleString("id-ID")}
            </span>
            <span className="text-stone-500">visitor counter</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-stone-400">
            <span className="inline-block h-3 w-6 animate-pulse rounded bg-stone-200" />
            <span>visitor counter</span>
          </div>
        )}
      </div>
    </div>
  );
}
