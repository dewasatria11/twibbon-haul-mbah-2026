"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Download,
  Edit3,
  Camera,
  CheckCircle2,
  Copy,
  Check,
  X,
} from "lucide-react";
import { downloadImage } from "@/lib/share";

interface ResultViewProps {
  resultBlob: Blob;
  resultDataUrl: string;
  onEditAgain: () => void;
  onNewPhoto: () => void;
}

const DEFAULT_CAPTION =
  "Mari sukseskan & hadiri Haul Ke-10 Almarhum Almaghfurlah K.H. Abu Chamid & Silaturrahim Alumni IMAB Tahun 2026 di Pondok Pesantren Al Ikhsan Beji, Kedungbanteng, Banyumas (Minggu, 22 November 2026). #HaulMbahKHAbuChamid #PonpesAlIkhsanBeji #IMAB2026";

export default function ResultView({
  resultBlob,
  resultDataUrl,
  onEditAgain,
  onNewPhoto,
}: ResultViewProps) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFE600", "#1ec295", "#000000", "#FF8C32"],
      });
    } catch {
      // ignore if confetti fails
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleDownload = () => {
    downloadImage(resultBlob, "twibbon-haul-mbah-2026.png");
    setShowSuccessModal(true);
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(DEFAULT_CAPTION);
      setCopied(true);
      showToast("📋 Caption berhasil disalin!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast("Gagal menyalin caption");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      {toastMsg && (
        <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-stone-800 bg-stone-900/95 px-5 py-2.5 text-xs font-medium text-white shadow-card backdrop-blur-md sm:text-sm">
          {toastMsg}
        </div>
      )}

      {/* Center White Alert Popup on Download */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
            />

            {/* Modal Card - Center White */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative z-10 w-full max-w-sm rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-7 shadow-modal text-center"
            >
              {/* Close X Button */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 focus:outline-none"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Success Icon */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-8 ring-emerald-50/50 mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-700" />
              </div>

              {/* Popup Title & Exact Message Requested */}
              <h3 className="font-display text-xl font-bold text-stone-900">
                Foto Berhasil Diunduh!
              </h3>
              <p className="mt-2 text-xs sm:text-sm font-medium text-stone-600 leading-relaxed">
                Berhasil di unduh, Silahkan lanjut salin caption
              </p>

              {/* Popup Actions */}
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  onClick={handleCopyCaption}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-royal hover:bg-royal-800 py-3 text-xs sm:text-sm font-semibold text-white shadow-card transition active:scale-[0.98]"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-300" />
                      <span>Caption Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Salin Caption Sekarang</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full rounded-2xl border border-stone-200/90 bg-stone-50 hover:bg-stone-100 py-2.5 text-xs font-semibold text-stone-700 transition"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="text-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/15 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-900"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
          <span>Twibbon Siap Digunakan</span>
        </motion.div>
        <h2 className="mt-3 text-2xl font-bold text-stone-900 sm:text-3xl">
          Alhamdulillah, Hasil Twibbon Anda
        </h2>
        <p className="mt-1 text-xs font-normal text-stone-600 sm:text-sm">
          Siap disimpan dengan kualitas Ultra HD dan dibagikan ke Story IG, WhatsApp, dan medsos.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 items-center gap-8 sm:mt-10 md:grid-cols-12">
        {/* Twibbon Preview Frame - Styled with green theme (bg-royal) */}
        <div className="mx-auto w-full max-w-xs md:col-span-6 lg:max-w-sm">
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="overflow-hidden rounded-3xl border-2 border-emerald-800/40 bg-royal p-3 shadow-card"
          >
            <img
              src={resultDataUrl}
              alt="Hasil Twibbon Haul KH. Abu Chamid"
              className="h-auto w-full rounded-2xl object-contain bg-stone-100 ring-1 ring-black/10"
            />
          </motion.div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-3.5 md:col-span-6">
          <button
            onClick={handleDownload}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-royal hover:bg-royal-800 py-3.5 text-sm font-semibold text-white shadow-card transition-all duration-300 hover:shadow-card-hover active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            <span>Unduh Foto (Ultra HD)</span>
          </button>

          <div className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">Caption Postingan:</span>
              <button
                onClick={handleCopyCaption}
                className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-700 transition"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-700" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Tersalin!" : "Salin Caption"}</span>
              </button>
            </div>
            <p className="mt-2.5 rounded-xl bg-stone-50 p-3 text-xs leading-relaxed text-stone-600 line-clamp-3">
              {DEFAULT_CAPTION}
            </p>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              onClick={onEditAgain}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-stone-200/90 bg-white hover:bg-stone-50 py-2.5 text-xs font-semibold text-stone-700 shadow-soft transition active:scale-[0.98]"
            >
              <Edit3 className="h-3.5 w-3.5 text-stone-500" />
              <span>Sesuaikan Ulang</span>
            </button>
            <button
              onClick={onNewPhoto}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-stone-200/90 bg-white hover:bg-stone-50 py-2.5 text-xs font-semibold text-stone-700 shadow-soft transition active:scale-[0.98]"
            >
              <Camera className="h-3.5 w-3.5 text-emerald-800" />
              <span>Ganti Foto Baru</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
