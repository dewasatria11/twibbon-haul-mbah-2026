"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Download,
  Share2,
  Edit3,
  Camera,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import { downloadImage, shareTwibbon } from "@/lib/share";

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

  const handleSave = () => {
    downloadImage(resultBlob, "twibbon-haul-mbah-kh-abu-chamid.png");
    showToast("✅ Foto Twibbon berhasil disimpan ke perangkat Anda!");
  };

  const handleShare = async () => {
    const res = await shareTwibbon(
      resultBlob,
      "Twibbon Haul Ke-10 KH. Abu Chamid",
      DEFAULT_CAPTION
    );
    if (res.success) {
      showToast(`✨ ${res.message}`);
    }
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
        <div className="mx-auto w-full max-w-xs md:col-span-6 lg:max-w-sm">
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-3 shadow-card"
          >
            <img
              src={resultDataUrl}
              alt="Hasil Twibbon Haul KH. Abu Chamid"
              className="h-auto w-full rounded-2xl object-contain bg-stone-100"
            />
          </motion.div>
        </div>

        <div className="flex flex-col gap-3.5 md:col-span-6">
          <button
            onClick={handleSave}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-royal hover:bg-royal-800 py-3.5 text-sm font-semibold text-white shadow-card transition-all duration-300 hover:shadow-card-hover active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            <span>Simpan / Unduh Foto (Ultra HD)</span>
          </button>

          <button
            onClick={handleShare}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] py-3.5 text-sm font-semibold text-white shadow-card transition-all duration-300 hover:shadow-card-hover active:scale-[0.98]"
          >
            <Share2 className="h-4 w-4" />
            <span>Bagikan ke WhatsApp / Medsos</span>
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
