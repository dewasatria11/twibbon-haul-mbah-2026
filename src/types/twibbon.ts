export interface PhotoTransform {
  offsetX: number; // Logical X coordinate (out of 2160), default ~1603.5 (center of cutout)
  offsetY: number; // Logical Y coordinate (out of 2700), default ~1350 (center of cutout)
  scale: number;   // Scale factor relative to original photo dimensions
  baseScale: number; // Initial auto-fit scale for reference (100% zoom = baseScale)
  rotation: number; // Rotation in degrees (0, 90, 180, 270, or fine-tuned)
  flipX: boolean;  // Horizontal mirror (for selfies)
}

export type AppStep = "landing" | "editor" | "result";
