/**
 * Triggers native browser download for a Blob
 */
export function downloadImage(blob: Blob, filename = "twibbon-haul-mbah-2026.png") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/**
 * Shares the generated Twibbon image reliably across all mobile browsers (Chrome, Safari, and Android built-in browsers)
 * Returns { success: boolean, method: string, message: string }
 */
export async function shareTwibbon(
  blob: Blob,
  title = "Twibbon Haul Ke-10 KH. Abu Chamid",
  text = "Mari sukseskan & hadiri Haul Ke-10 Almarhum Almaghfurlah K.H. Abu Chamid & Silaturrahim Alumni IMAB Tahun 2026 di Pondok Pesantren Al Ikhsan Beji, Kedungbanteng, Banyumas (Minggu, 22 November 2026). #HaulMbahKHAbuChamid #PonpesAlIkhsanBeji #IMAB2026"
): Promise<{ success: boolean; method: string; message: string }> {
  const filename = "twibbon-haul-mbah-2026.png";
  const file = new File([blob], filename, {
    type: "image/png",
    lastModified: Date.now(),
  });

  // 1. Try Web Share API Level 2 (files sharing)
  // PENTING: Jangan kirim parameter `text` bersama `files` di Android!
  // Jika `text` dikirim bersamaan dengan file gambar, intent handler WhatsApp di Android
  // akan mengalami konflik intent dan memunculkan error: "Can't send empty message".
  // Mengirim murni `files: [file]` membuat WhatsApp langsung mengenali ini sebagai kiriman foto.
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    let canShareFile = true;
    try {
      if (typeof navigator.canShare === "function") {
        canShareFile = navigator.canShare({ files: [file] });
      }
    } catch {
      canShareFile = true;
    }

    if (canShareFile) {
      try {
        await navigator.share({
          files: [file],
        });
        return {
          success: true,
          method: "native",
          message: "Twibbon berhasil dibagikan!",
        };
      } catch (err: unknown) {
        const errName = (err as Error)?.name;
        if (errName === "AbortError") {
          return { success: false, method: "canceled", message: "Batal dibagikan" };
        }
        // Jika gagal murni files, coba tambahkan title (tanpa parameter text yang rawan bug)
        try {
          await navigator.share({
            title: title,
            files: [file],
          });
          return {
            success: true,
            method: "native",
            message: "Twibbon berhasil dibagikan!",
          };
        } catch (innerErr: unknown) {
          if ((innerErr as Error)?.name === "AbortError") {
            return { success: false, method: "canceled", message: "Batal dibagikan" };
          }
        }
      }
    }
  }

  // 2. Fallback untuk Browser Bawaan / WebView yang tidak mendukung Web Share File:
  // a. Unduh foto twibbon langsung ke Galeri / Download perangkat
  downloadImage(blob, filename);

  // b. Salin caption resmi ke clipboard pengguna
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
  } catch {
    // abaikan jika clipboard dibatasi browser
  }

  // c. Buka WhatsApp menggunakan direct endpoint (api.whatsapp.com), hindari wa.me redirect yang sering memotong teks di browser bawaan
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareText = `Foto Twibbon Haul Ke-10 KH. Abu Chamid telah tersimpan di Galeri. Buat twibbon Anda juga di: ${origin}`;
  const directWaUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  try {
    // Navigasi langsung tanpa popup blocker
    window.location.href = directWaUrl;
  } catch {
    window.open(directWaUrl, "_blank");
  }

  return {
    success: true,
    method: "fallback",
    message: "Foto Twibbon tersimpan di Galeri & WhatsApp dibuka!",
  };
}


