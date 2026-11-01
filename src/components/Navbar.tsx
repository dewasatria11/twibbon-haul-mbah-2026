"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-3 sm:px-6 sm:py-3.5">
        <a
          href="/"
          className="flex items-center justify-center transition-opacity hover:opacity-90 active:scale-[0.98] focus:outline-none"
          title="Pondok Pesantren Al Ikhsan Beji"
        >
          <img
            src="/header-web-twibbon.svg"
            alt="Pondok Pesantren Al Ikhsan Beji Banyumas"
            className="h-11 w-auto object-contain sm:h-12 md:h-14"
          />
        </a>
      </div>
    </motion.header>
  );
}



