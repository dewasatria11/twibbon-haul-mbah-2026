"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, MapPin, Youtube, Camera } from "lucide-react";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerUpload: () => void;
}

export default function EventDetailsModal({
  isOpen,
  onClose,
  onTriggerUpload,
}: EventDetailsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-6 shadow-modal sm:p-7"
          >
            {/* Header Modal */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                  Agenda Haul & Silaturrahim
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-stone-900">
                  Haul Ke-10 K.H. Abu Chamid
                </h2>
                <p className="mt-0.5 text-xs text-stone-500">
                  Pondok Pesantren Al Ikhsan Beji, Kedungbanteng, Banyumas
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 focus:outline-none"
                aria-label="Tutup modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content Body - Anti-Slop Editorial */}
            <div className="mt-5 space-y-4 text-left">
              {/* Mauidhoh Hasanah Section */}
              <div className="rounded-2xl border-l-2 border-emerald-800 bg-emerald-950/[0.03] p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Mauidhoh Hasanah
                </span>
                <p className="mt-0.5 text-base font-bold text-stone-900">
                  KH. Achmad Sobirin Syamsuri
                </p>
                <p className="mt-0.5 text-xs text-stone-600">
                  Pengasuh PP Al Mujahidin, Rawalo, Banyumas
                </p>
              </div>

              {/* Tanggal, Waktu & Tempat */}
              <div className="space-y-2.5 rounded-2xl border border-stone-100 bg-stone-50/70 p-4 text-xs text-stone-700">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-emerald-800 shrink-0" />
                  <div>
                    <span className="text-stone-400">Hari & Tanggal: </span>
                    <strong className="font-semibold text-stone-900">Minggu, 22 November 2026</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-emerald-800 shrink-0" />
                  <div>
                    <span className="text-stone-400">Waktu: </span>
                    <strong className="font-semibold text-stone-900">07.30 WIB - Selesai</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-emerald-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-stone-400">Lokasi: </span>
                    <strong className="font-semibold text-stone-900">Komplek Maqam PP Al Ikhsan Beji</strong>
                    <span className="block text-[11px] text-stone-500">Kedungbanteng, Banyumas, Jawa Tengah</span>
                  </div>
                </div>
              </div>

              {/* Live Streaming Row */}
              <a
                href="https://youtube.com/@pondokpesantrenal-ikhsanbe5093?si=ijxBfUEIgs9dX87a"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl border border-stone-200/90 bg-white px-4 py-3 text-xs text-stone-700 transition hover:bg-stone-50 hover:border-stone-300"
              >
                <div className="flex items-center gap-2.5">
                  <Youtube className="h-4 w-4 text-red-600 shrink-0" />
                  <span>Siaran Langsung: <strong className="font-semibold text-stone-900">Ponpes Al Ikhsan Beji</strong></span>
                </div>
                <span className="font-semibold text-emerald-800">Buka →</span>
              </a>
            </div>

            {/* Single Prominent CTA */}
            <div className="mt-6">
              <button
                onClick={() => {
                  onClose();
                  onTriggerUpload();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-royal hover:bg-royal-800 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-card transition active:scale-[0.98]"
              >
                <Camera className="h-4 w-4" />
                <span>Buat Twibbon Sekarang</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
