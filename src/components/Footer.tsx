"use client";

import React from "react";
import VisitorCounter from "./VisitorCounter";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200/70 bg-white py-6 text-center text-xs">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* 1. Visitor Counter */}
        <VisitorCounter />

        {/* 2. Kalimat Hurmat Haul */}
        <p className="font-medium text-stone-600">
          Hurmat Haul Mbah KH. Abu Chamid Ke-10
        </p>

        {/* 3. Website by */}
        <p className="mt-1 text-[11px] text-stone-400">
          Website by @alikhsanmedia
        </p>
      </div>
    </footer>
  );
}




