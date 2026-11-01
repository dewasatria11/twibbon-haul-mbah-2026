/**
 * Triggers native browser download for a Blob
 */
export function downloadImage(blob: Blob, filename = "Twibbon-Haul-KH-Abu-Chamid-2026.png") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Attempts to share the generated Twibbon via Web Share API
 * Returns { success: boolean, method: "native" | "whatsapp" | "canceled" }
 */
export async function shareTwibbon(
  blob: Blob,
  title = "Twibbon Haul Ke-10 KH. Abu Chamid",
  text = "Mari sukseskan & hadiri Haul Ke-10 Almarhum Almaghfurlah K.H. Abu Chamid & Silaturrahim Alumni IMAB Tahun 2026 di Pondok Pesantren Al Ikhsan Beji, Kedungbanteng, Banyumas (Minggu, 22 November 2026). #HaulMbahKHAbuChamid #PonpesAlIkhsanBeji #IMAB2026"
): Promise<{ success: boolean; method: string; message: string }> {
  const file = new File([blob], "Twibbon-Haul-KH-Abu-Chamid-2026.png", {
    type: "image/png",
  });

  // 1. Try Web Share API with Files support (Mobile Chrome, Safari iOS)
  if (
    typeof navigator !== "undefined" &&
    navigator.canShare &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        files: [file],
        title,
        text,
      });
      return {
        success: true,
        method: "native",
        message: "Twibbon berhasil dibagikan!",
      };
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") {
        return { success: false, method: "canceled", message: "Batal dibagikan" };
      }
    }
  }

  // 2. Fallback: Download file and open WhatsApp Web / App with prefilled message
  downloadImage(blob, "Twibbon-Haul-KH-Abu-Chamid-2026.png");
  
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const waUrl = `https://wa.me/?text=${encodeURIComponent(
    `${text}\n\nBuat twibbon Anda juga di: ${currentUrl}`
  )}`;

  setTimeout(() => {
    window.open(waUrl, "_blank");
  }, 400);

  return {
    success: true,
    method: "whatsapp",
    message: "Foto berhasil diunduh & WhatsApp dibuka untuk dibagikan!",
  };
}

