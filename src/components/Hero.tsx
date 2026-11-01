"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Calendar, MapPin, ArrowRight } from "lucide-react";

interface HeroProps {
  onTriggerUpload: () => void;
  onOpenInfo: () => void;
}

export default function Hero({ onTriggerUpload, onOpenInfo }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-10 sm:py-16">
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-[640px] rounded-full bg-emerald-700/[0.04] blur-3xl" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center lg:col-span-7 lg:text-left"
          >
            <h1 className="text-3xl font-normal tracking-tight text-stone-900 sm:text-4xl lg:text-5xl lg:leading-[1.18] font-display">
              Semarakkan Haul Ke-10{" "}
              <span className="block mt-1 sm:inline text-emerald-900 font-display italic font-bold">
                K.H. Abu Chamid
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm font-normal leading-relaxed text-stone-600 sm:text-base lg:mx-0">
              Pasang dan sesuaikan foto Anda pada twibbon haul cepat dan mudah.
            </p>

            {/* Date & Location Plain Text */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-stone-600 lg:justify-start">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-emerald-800 shrink-0" />
                <span>Minggu, 22 Nov 2026 • 07.30 WIB</span>
              </span>
              <span className="hidden sm:inline text-stone-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-800 shrink-0" />
                <span>Komplek Maqam PP Al Ikhsan Beji</span>
              </span>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <button
                onClick={onTriggerUpload}
                className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-royal hover:bg-royal-800 px-7 py-3.5 text-sm font-semibold text-white shadow-card transition-all duration-300 hover:shadow-card-hover active:scale-[0.98] sm:w-auto"
              >
                <Camera className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Buat Twibbon Sekarang</span>
              </button>

              <button
                onClick={onOpenInfo}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-200/90 bg-white hover:bg-stone-50 px-6 py-3.5 text-sm font-medium text-stone-700 shadow-soft transition-all duration-300 hover:border-stone-300 active:scale-[0.98] sm:w-auto"
              >
                <span>Detail Acara</span>
                <ArrowRight className="h-3.5 w-3.5 text-stone-400" />
              </button>
            </div>

            {/* 3 Step Guidance - Compact 3-Column on Mobile & Desktop */}
            <div className="mt-8 border-t border-stone-200/70 pt-5">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div className="flex flex-col items-center">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-800 border border-emerald-900/10">
                    1
                  </span>
                  <p className="mt-1 text-xs font-bold text-stone-900">Pilih Foto</p>
                  <p className="text-[10px] text-stone-500 hidden sm:block">Dari galeri ponsel / PC</p>
                </div>

                <div className="flex flex-col items-center">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-800 border border-emerald-900/10">
                    2
                  </span>
                  <p className="mt-1 text-xs font-bold text-stone-900">Atur Posisi</p>
                  <p className="text-[10px] text-stone-500 hidden sm:block">Geser & cubit zoom</p>
                </div>

                <div className="flex flex-col items-center">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-800 border border-emerald-900/10">
                    3
                  </span>
                  <p className="mt-1 text-xs font-bold text-stone-900">Simpan & Siar</p>
                  <p className="text-[10px] text-stone-500 hidden sm:block">Kualitas Ultra HD</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Floating Preview Card with Looping Animation on Card Only */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-xs sm:max-w-sm lg:col-span-5"
          >
            <motion.div
              animate={{
                y: [0, -22, 0],
                rotate: [-1.2, 1.2, -1.2],
                boxShadow: [
                  "0 12px 28px -6px rgba(15, 62, 47, 0.08)",
                  "0 28px 52px -10px rgba(15, 62, 47, 0.22)",
                  "0 12px 28px -6px rgba(15, 62, 47, 0.08)",
                ],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              onClick={onTriggerUpload}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-3 transition-all duration-300 hover:border-emerald-800/40"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-stone-100">
                <div className="absolute inset-y-0 right-0 flex w-[52%] flex-col items-center justify-center bg-emerald-950/[0.04] p-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-900/10 bg-white text-emerald-800 shadow-soft">
                    <Camera className="h-5 w-5 stroke-[2]" />
                  </div>
                  <p className="mt-3 text-xs font-semibold text-stone-800">Foto Anda di Sini</p>
                  <p className="mt-0.5 text-[11px] text-stone-500">Ketuk untuk pilih foto</p>
                </div>

                <img
                  src="/revisi-HAUL MBAH ABU CHAMID KE 10.png"
                  alt="Twibbon Haul Mbah 2026"
                  className="relative z-10 h-full w-full object-contain pointer-events-none select-none"
                />
              </div>

              {/* Label - Plain text without button */}
              <div className="py-2.5 text-center">
                <p className="text-xs font-semibold text-stone-700 transition-colors group-hover:text-emerald-900">
                  Twibbon Haul Mbah 2026
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
