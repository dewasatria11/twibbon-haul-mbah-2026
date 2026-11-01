'use client';

// TwibbonShare.tsx
// Hook + dialog untuk tombol "Bagikan ke aplikasi" di web generator twibbon (Next.js,
// App Router) yang tetap berguna di browser bawaan Android.
//
// Alur:
//  1) Browser mendukung share file -> sheet native (WhatsApp, IG, Galeri, dst.)
//  2) Tidak mendukung / ditolak    -> dialog cadangan di halaman yang sama, jadi hasil
//     twibbon tidak hilang karena halaman berpindah:
//       - gambar sebagai <img> (tekan lama = "Simpan gambar" / "Bagikan")
//       - kirim caption + link ke WhatsApp, salin caption, unduh gambar
//
// Pemakaian (di Client Component):
//
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const { prepare, share, showFallback, dialogProps } = useTwibbonShare({
//     canvasRef,
//     caption: 'Saya sudah pakai twibbon ini!',      // string atau () => string
//     pageUrl: 'https://domainmu.com/twibbon/nama',  // link kampanye; '' kalau tidak mau
//   });
//
//   useEffect(() => {
//     drawTwibbon();   // gambar ulang canvas
//     prepare();       // WAJIB dipanggil setiap canvas berubah
//   }, [photo, zoom, offset]);
//
//   <button onClick={share}>Bagikan ke aplikasi</button>
//   <button onClick={showFallback}>Gagal membagikan? Coba cara lain</button>
//   <ShareFallbackDialog {...dialogProps} />
//
// Catatan:
//  - Jangan pasang pointer-events:none / user-select:none / preventDefault('contextmenu')
//    pada gambar hasil. Itu mematikan tekan-lama-simpan.
//  - Kalau frame/foto dimuat dari domain lain, set img.crossOrigin = 'anonymous' (dan
//    server mengirim header CORS). Kalau tidak, canvas tercemar dan toBlob() melempar
//    SecurityError.
//  - Kalau memakai paket `motion` (bukan `framer-motion`), ganti import menjadi
//    'motion/react'.

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';
import { createPortal } from 'react-dom';

/* ------------------------------------------------------------------ */
/* util                                                                */
/* ------------------------------------------------------------------ */

function canShareFile(file: File): boolean {
  try {
    return (
      typeof navigator.share === 'function' &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [file] })
    );
  } catch {
    return false;
  }
}

function legacyCopy(text: string): boolean {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    Object.assign(ta.style, { position: 'fixed', top: '0', left: '0', opacity: '0' });
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // jatuh ke cara lama
  }
  return legacyCopy(text);
}

/* ------------------------------------------------------------------ */
/* hook                                                                */
/* ------------------------------------------------------------------ */

export type ShareResult = 'shared' | 'cancelled' | 'fallback' | 'error';

export type UseTwibbonShareOptions = {
  canvasRef?: RefObject<HTMLCanvasElement | null>;
  blob?: Blob | null;
  caption: string | (() => string);
  /** Link yang ikut dikirim. Default: halaman ini. Isi '' kalau tidak mau ada link. */
  pageUrl?: string;
  fileName?: string;
  /** 'image/jpeg' lebih kecil, tapi area transparan jadi hitam. */
  mime?: 'image/png' | 'image/jpeg';
  quality?: number;
  onError?: (err: unknown) => void;
};

type FallbackState = { url: string; text: string; fileName: string };

export function useTwibbonShare(options: UseTwibbonShareOptions) {
  const optsRef = useRef(options);
  useEffect(() => {
    optsRef.current = options;
  });

  const prepared = useRef<File | null>(null);
  const version = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const urlRef = useRef<string | null>(null);

  const [open, setOpen] = useState(false);
  const [fallback, setFallback] = useState<FallbackState | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    []
  );

  const buildText = useCallback((): string => {
    const o = optsRef.current;
    const caption = typeof o.caption === 'function' ? o.caption() : o.caption;
    const url = o.pageUrl ?? `${window.location.origin}${window.location.pathname}`;
    return [caption, url].filter(Boolean).join('\n');
  }, []);

  const toFile = useCallback(
    () =>
      new Promise<File>((resolve, reject) => {
        const o = optsRef.current;
        const fileName = o.fileName ?? 'twibbon-haul-mbah-2026.png';
        const mime = o.mime ?? 'image/png';
        if (o.blob) {
          return resolve(new File([o.blob], fileName, { type: o.blob.type || mime }));
        }
        const canvas = o.canvasRef?.current;
        if (!canvas) return reject(new Error('Canvas belum siap'));
        try {
          canvas.toBlob(
            (blob) =>
              blob
                ? resolve(new File([blob], fileName, { type: mime }))
                : reject(new Error('Gagal membuat gambar dari canvas')),
            mime,
            o.quality ?? 0.92
          );
        } catch (err) {
          reject(err); // mis. SecurityError pada canvas tercemar
        }
      }),
    []
  );

  const fail = useCallback((err: unknown): ShareResult => {
    console.error(err);
    optsRef.current.onError?.(err);
    return 'error';
  }, []);

  const openFallback = useCallback((file: File, text: string) => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const url = URL.createObjectURL(file);
    urlRef.current = url;
    setFallback({ url, text, fileName: file.name });
    setOpen(true);
  }, []);

  /**
   * Siapkan File di belakang layar supaya share() bisa memanggil navigator.share
   * langsung di dalam gesture klik (syarat browser, terutama Safari).
   * Panggil setiap canvas selesai digambar ulang.
   */
  const prepare = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    const v = ++version.current;
    prepared.current = null;
    timer.current = setTimeout(() => {
      toFile().then(
        (file) => {
          if (v === version.current) prepared.current = file;
        },
        () => {
          // dilaporkan saat share() dipanggil
        }
      );
    }, 250);
  }, [toFile]);

  const share = useCallback(async (): Promise<ShareResult> => {
    let file = prepared.current;
    if (!file) {
      try {
        file = await toFile();
      } catch (err) {
        return fail(err);
      }
    }
    const text = buildText();

    if (canShareFile(file)) {
      // Cadangan: kalau aplikasi tujuan membuang teks, caption tinggal di-paste.
      // Sengaja tanpa await supaya navigator.share tetap sinkron dari gesture klik.
      navigator.clipboard?.writeText(text).catch(() => {});
      try {
        // Hanya files + text. title/url sekaligus sering membuat WhatsApp memakai
        // salah satunya saja, atau menampilkan "empty message".
        await navigator.share({ files: [file], text });
        return 'shared';
      } catch (err) {
        if ((err as { name?: string } | null)?.name === 'AbortError') return 'cancelled';
        // error lain (NotAllowedError dll): lanjut ke dialog cadangan
      }
    }

    openFallback(file, text);
    return 'fallback';
  }, [toFile, buildText, fail, openFallback]);

  /**
   * Untuk link "Gagal membagikan? Coba cara lain". Perlu karena share native kadang
   * "berhasil" di sisi browser tapi ditolak aplikasi tujuan, dan itu tidak bisa
   * dideteksi dari JavaScript.
   */
  const showFallback = useCallback(async (): Promise<ShareResult> => {
    try {
      openFallback(prepared.current ?? (await toFile()), buildText());
      return 'fallback';
    } catch (err) {
      return fail(err);
    }
  }, [toFile, buildText, fail, openFallback]);

  const closeFallback = useCallback(() => setOpen(false), []);

  return {
    prepare,
    share,
    showFallback,
    closeFallback,
    /** Spread ke <ShareFallbackDialog {...dialogProps} /> */
    dialogProps: {
      open,
      imageUrl: fallback ? fallback.url : null,
      text: fallback ? fallback.text : '',
      fileName: fallback ? fallback.fileName : 'twibbon.png',
      onClose: closeFallback,
    },
  };
}

/* ------------------------------------------------------------------ */
/* dialog                                                              */
/* ------------------------------------------------------------------ */

const S: Record<string, CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2147483000,
    background: 'rgba(0,0,0,.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    boxSizing: 'border-box',
  },
  panel: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '100%',
    overflowY: 'auto',
    boxSizing: 'border-box',
    background: '#fff',
    color: '#1b1f23',
    borderRadius: 16,
    padding: 16,
    outline: 'none',
    font: '14px/1.45 system-ui, sans-serif',
  },
  title: { margin: 0, font: '700 18px/1.3 system-ui, sans-serif' },
  img: {
    display: 'block',
    maxWidth: '100%',
    maxHeight: '45vh',
    margin: '12px auto',
    borderRadius: 10,
    WebkitTouchCallout: 'default',
    userSelect: 'auto',
  },
  hint: { margin: '0 0 4px', color: '#4a5560' },
  btn: {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: 48,
    margin: '8px 0 0',
    padding: '12px 16px',
    border: 0,
    borderRadius: 10,
    font: '600 15px/1.2 system-ui, sans-serif',
    textAlign: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
    background: '#eef0f2',
    color: '#1b1f23',
  },
};
S.btnPrimary = { ...S.btn, background: '#128C7E', color: '#fff' };

export type ShareFallbackDialogProps = {
  open: boolean;
  imageUrl: string | null;
  text: string;
  fileName: string;
  onClose: () => void;
};

export function ShareFallbackDialog({
  open,
  imageUrl,
  text,
  fileName,
  onClose,
}: ShareFallbackDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [copyLabel, setCopyLabel] = useState('Salin caption');
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Portal ke <body>: elemen position:fixed di dalam induk yang punya transform
  // (umum di Framer Motion) bisa salah posisi.
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const handleCopy = async () => {
    const ok = await copyText(text);
    setCopyLabel(ok ? 'Tersalin ✓' : 'Gagal menyalin');
    setTimeout(() => setCopyLabel('Salin caption'), 1500);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && imageUrl && (
        <motion.div
          key="twibbon-share-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Bagikan twibbon"
          style={S.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            style={S.panel}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 32, scale: reduceMotion ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 16, scale: reduceMotion ? 1 : 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          >
            <h2 style={S.title}>Bagikan twibbon</h2>

            {/* Pakai <img> (bukan canvas) supaya tekan-lama menampilkan "Simpan gambar". */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Hasil twibbon kamu" style={S.img} />

            <p style={S.hint}>
              Browser ini belum mendukung berbagi gambar langsung ke aplikasi. Tekan lama gambar
              di atas lalu pilih &ldquo;Simpan gambar&rdquo; atau &ldquo;Bagikan&rdquo;. Tombol
              WhatsApp di bawah hanya mengirim caption dan link; lampirkan gambarnya sendiri di
              chat.
            </p>

            <button type="button" data-action="wa" style={S.btnPrimary} onClick={handleWhatsApp}>
              Kirim caption + link ke WhatsApp
            </button>
            <button type="button" data-action="copy" style={S.btn} onClick={handleCopy}>
              {copyLabel}
            </button>
            <a data-action="download" href={imageUrl} download={fileName} style={S.btn}>
              Unduh gambar
            </a>
            <button type="button" data-action="close" style={S.btn} onClick={onClose}>
              Tutup
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
