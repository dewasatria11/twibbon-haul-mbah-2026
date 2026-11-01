import type { PhotoTransform } from "@/types/twibbon";

// Exact dimensions of HAUL mbah twibon.png
export const TWIBBON_WIDTH = 2160;
export const TWIBBON_HEIGHT = 2700;

// The transparent cutout area in HAUL mbah twibon.png is x: [1047, 2160], y: [0, 2700]
export const CUTOUT_LEFT = 1047;
export const CUTOUT_WIDTH = 2160 - 1047; // 1113px
export const CUTOUT_HEIGHT = 2700;
export const CUTOUT_CENTER_X = CUTOUT_LEFT + CUTOUT_WIDTH / 2; // 1603.5
export const CUTOUT_CENTER_Y = 1350;

let cachedFrameImage: HTMLImageElement | null = null;

/**
 * Loads an image from a URL and returns an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Loads and caches the Twibbon frame PNG
 */
export async function getTwibbonFrame(): Promise<HTMLImageElement> {
  if (cachedFrameImage && cachedFrameImage.complete) {
    return cachedFrameImage;
  }
  try {
    const img = await loadImage("/new HAUL mbah twibon.png");
    cachedFrameImage = img;
    return img;
  } catch {
    const img = await loadImage("/twibbon-frame.png");
    cachedFrameImage = img;
    return img;
  }
}

/**
 * Calculates initial transform so any uploaded photo automatically fits
 * and centers nicely inside the transparent right-side cutout of the twibbon
 */
export function calculateInitialTransform(userImg: HTMLImageElement): PhotoTransform {
  const imgW = userImg.naturalWidth || userImg.width;
  const imgH = userImg.naturalHeight || userImg.height;

  // Target area to cover comfortably (slightly wider than cutout to avoid gaps at edges)
  const targetW = CUTOUT_WIDTH * 1.08;
  const targetH = CUTOUT_HEIGHT * 0.92;

  const scaleX = targetW / imgW;
  const scaleY = targetH / imgH;
  const baseScale = Math.max(scaleX, scaleY);

  return {
    offsetX: CUTOUT_CENTER_X,
    offsetY: CUTOUT_CENTER_Y - 40, // Slightly above dead-center because footer is at bottom
    scale: baseScale,
    baseScale,
    rotation: 0,
    flipX: false,
  };
}

/**
 * Draws the user photo + twibbon frame onto any target canvas.
 * Works identically for both the live preview canvas (e.g. 1080x1350)
 * and the final high-res export canvas (2160x2700).
 */
export function renderTwibbonToCanvas(
  canvas: HTMLCanvasElement,
  frameImg: HTMLImageElement,
  userImg: HTMLImageElement | null,
  transform: PhotoTransform,
  options?: {
    isInteracting?: boolean;
  }
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;
  const ratio = W / TWIBBON_WIDTH;

  ctx.clearRect(0, 0, W, H);

  // 1. Background fill (soft warm white so zoomed-out edges look clean)
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, W, H);

  // 2. Draw user photo with transform
  if (userImg) {
    ctx.save();
    const cx = transform.offsetX * ratio;
    const cy = transform.offsetY * ratio;

    ctx.translate(cx, cy);
    ctx.rotate((transform.rotation * Math.PI) / 180);

    const effectiveScale = transform.scale * ratio;
    ctx.scale(
      transform.flipX ? -effectiveScale : effectiveScale,
      effectiveScale
    );

    const imgW = userImg.naturalWidth || userImg.width;
    const imgH = userImg.naturalHeight || userImg.height;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(userImg, -imgW / 2, -imgH / 2, imgW, imgH);
    ctx.restore();
  }

  // 3. Draw Twibbon Frame overlay on top
  ctx.save();
  // When user is actively dragging/pinching, make frame slightly translucent (90%)
  // so they can see where their photo edges are behind the border
  if (options?.isInteracting) {
    ctx.globalAlpha = 0.90;
  } else {
    ctx.globalAlpha = 1.0;
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(frameImg, 0, 0, W, H);
  ctx.restore();
}

/**
 * Generates the final full-resolution (2160x2700) Twibbon PNG Blob & DataURL
 */
export async function generateHighResTwibbon(
  frameImg: HTMLImageElement,
  userImg: HTMLImageElement,
  transform: PhotoTransform
): Promise<{ dataUrl: string; blob: Blob }> {
  const offscreen = document.createElement("canvas");
  offscreen.width = TWIBBON_WIDTH;
  offscreen.height = TWIBBON_HEIGHT;

  renderTwibbonToCanvas(offscreen, frameImg, userImg, transform, {
    isInteracting: false,
  });

  const dataUrl = offscreen.toDataURL("image/png", 1.0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    offscreen.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Gagal membuat file gambar"));
      },
      "image/png",
      1.0
    );
  });

  return { dataUrl, blob };
}

