import { detectBrowser } from "./browserDetect";

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
 * Checks if the browser supports sharing files via Web Share API
 */
export function canShareFile(file: File): boolean {
  try {
    const { isBuiltInBrowser } = detectBrowser();
    if (isBuiltInBrowser) return false;

    return (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] })
    );
  } catch {
    return false;
  }
}

/**
 * Shares the generated Twibbon via native Web Share API (Chrome, Safari, Samsung Internet baru)
 * Jika browser tidak mendukung atau menolak (misal browser bawaan Android),
 * mengembalikan method: "unsupported" agar web langsung menampilkan alert.
 */
export async function shareTwibbon(
  blob: Blob,
  title = "Twibbon Haul Ke-10 KH. Abu Chamid",
  caption = "Mari sukseskan & hadiri Haul Ke-10 Almarhum Almaghfurlah K.H. Abu Chamid & Silaturrahim Alumni IMAB Tahun 2026 di Pondok Pesantren Al Ikhsan Beji, Kedungbanteng, Banyumas (Minggu, 22 November 2026). #HaulMbahKHAbuChamid #PonpesAlIkhsanBeji #IMAB2026"
): Promise<{ success: boolean; method: string; message: string }> {
  const filename = "twibbon-haul-mbah-2026.png";
  let file: File;
  try {
    file = new File([blob], filename, {
      type: blob.type || "image/png",
      lastModified: Date.now(),
    });
  } catch {
    return {
      success: false,
      method: "unsupported",
      message: "Belum berhasil share, silakan download gambar saja.",
    };
  }

  if (canShareFile(file)) {
    // Cadangan: copy caption ke clipboard jika WhatsApp hanya mengambil gambarnya
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(caption).catch(() => {});
    }

    try {
      await navigator.share({
        files: [file],
        text: caption,
      });
      return {
        success: true,
        method: "native",
        message: "Twibbon berhasil dibagikan!",
      };
    } catch (err: unknown) {
      const errName = (err as { name?: string } | null)?.name;
      if (errName === "AbortError") {
        return { success: false, method: "cancelled", message: "Batal dibagikan" };
      }
      return {
        success: false,
        method: "unsupported",
        message: "Belum berhasil share, silakan download gambar saja.",
      };
    }
  }

  return {
    success: false,
    method: "unsupported",
    message: "Belum berhasil share, silakan download gambar saja.",
  };
}



