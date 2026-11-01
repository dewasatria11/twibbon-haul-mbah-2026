"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  FlipHorizontal,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Camera,
  Hand,
} from "lucide-react";
import { PhotoTransform } from "@/types/twibbon";
import {
  TWIBBON_WIDTH,
  calculateInitialTransform,
  renderTwibbonToCanvas,
  generateHighResTwibbon,
} from "@/lib/canvas";

interface TwibbonEditorProps {
  userImage: HTMLImageElement;
  frameImage: HTMLImageElement;
  onBack: () => void;
  onChangePhoto: () => void;
  onGenerate: (blob: Blob, dataUrl: string) => void;
}

export default function TwibbonEditor({
  userImage,
  frameImage,
  onBack,
  onChangePhoto,
  onGenerate,
}: TwibbonEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [transform, setTransform] = useState<PhotoTransform>(() =>
    calculateInitialTransform(userImage)
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartScaleRef = useRef<number>(1);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderTwibbonToCanvas(canvas, frameImage, userImage, transform, {
      isInteracting,
    });
  }, [frameImage, userImage, transform, isInteracting]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.05 : 0.95;
      setTransform((prev) => ({
        ...prev,
        scale: Math.min(Math.max(prev.scale * factor, prev.baseScale * 0.3), prev.baseScale * 5),
      }));
    };
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setIsInteracting(true);

    if (pointersRef.current.size === 2) {
      const pts = Array.from(pointersRef.current.values());
      pinchStartDistRef.current = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStartScaleRef.current = transform.scale;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    const prevPt = pointersRef.current.get(e.pointerId)!;
    const currentPt = { x: e.clientX, y: e.clientY };
    pointersRef.current.set(e.pointerId, currentPt);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleToLogical = TWIBBON_WIDTH / rect.width;

    if (pointersRef.current.size === 1) {
      const dx = (currentPt.x - prevPt.x) * scaleToLogical;
      const dy = (currentPt.y - prevPt.y) * scaleToLogical;
      setTransform((prev) => ({ ...prev, offsetX: prev.offsetX + dx, offsetY: prev.offsetY + dy }));
    } else if (pointersRef.current.size === 2 && pinchStartDistRef.current) {
      const pts = Array.from(pointersRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const ratio = dist / pinchStartDistRef.current;
      setTransform((prev) => ({
        ...prev,
        scale: Math.min(Math.max(pinchStartScaleRef.current * ratio, prev.baseScale * 0.3), prev.baseScale * 5),
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchStartDistRef.current = null;
    if (pointersRef.current.size === 0) setIsInteracting(false);
  };

  const zoomPercent = Math.round((transform.scale / transform.baseScale) * 100);
  const handleZoomChange = (pct: number) => {
    const clamped = Math.min(Math.max(pct, 30), 400);
    setTransform((prev) => ({ ...prev, scale: (clamped / 100) * prev.baseScale }));
  };

  const handleFinalGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      await new Promise((r) => setTimeout(r, 50));
      const { blob, dataUrl } = await generateHighResTwibbon(frameImage, userImage, transform);
      onGenerate(blob, dataUrl);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Top Navigation */}
      <div className="mb-6 sm:mb-8 border-b border-stone-200/80 pb-4 sm:pb-5">
        {/* Top row: Left "Kembali", Right "Langkah 2 dari 3" */}
        <div className="flex w-full items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-xl border border-stone-200/90 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 shadow-soft transition-all hover:bg-stone-50 active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4 text-stone-500" />
            <span>Kembali</span>
          </button>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/15 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-900">
            Langkah 2 dari 3
          </span>
        </div>

        {/* Second row: Centered full-width title */}
        <h2 className="mt-3.5 w-full text-center text-sm sm:text-base font-bold text-stone-900">
          Sesuaikan Posisi & Ukuran Foto
        </h2>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Canvas Area */}
        <div className="flex flex-col items-center lg:col-span-7">
          {/* Action & Gesture bar right above photo */}
          <div className="mb-3 flex w-full max-w-[340px] sm:max-w-[380px] items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-white/90 px-3 py-1.5 text-[11px] font-medium text-stone-600 shadow-soft backdrop-blur-sm">
              <Hand className="h-3.5 w-3.5 text-emerald-800 shrink-0" />
              <span>Geser • Cubit/scroll zoom</span>
            </div>

            <button
              onClick={onChangePhoto}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/90 bg-white hover:bg-stone-50 px-3.5 py-1.5 text-[11px] font-semibold text-stone-700 shadow-soft transition-all active:scale-[0.98]"
            >
              <Camera className="h-3.5 w-3.5 text-emerald-800 shrink-0" />
              <span>Ganti Foto</span>
            </button>
          </div>

          <div className="relative w-full max-w-[340px] sm:max-w-[380px] overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-3 shadow-card">
            <canvas
              ref={canvasRef}
              width={1080}
              height={1350}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="h-auto w-full cursor-grab active:cursor-grabbing block rounded-2xl bg-stone-100"
              style={{ touchAction: "none" }}
            />
          </div>
        </div>

        {/* Controls Column */}
        <div className="flex flex-col gap-4 lg:col-span-5">
          <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Presisi Posisi
              </h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-900">
                Zoom {zoomPercent}%
              </span>
            </div>

            {/* Zoom Slider */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-stone-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <ZoomIn className="h-4 w-4 text-emerald-800" />
                  <span>Skala Foto</span>
                </span>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => handleZoomChange(zoomPercent - 10)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-700 transition hover:bg-stone-100 active:scale-95"
                  title="Perkecil"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <input
                  type="range"
                  min="40"
                  max="300"
                  value={zoomPercent}
                  onChange={(e) => handleZoomChange(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <button
                  onClick={() => handleZoomChange(zoomPercent + 10)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-700 transition hover:bg-stone-100 active:scale-95"
                  title="Perbesar"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              <button
                onClick={() => setTransform((prev) => ({ ...prev, rotation: (prev.rotation + 90) % 360 }))}
                className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-stone-200/90 bg-stone-50/80 hover:bg-stone-100 py-3 text-xs font-semibold text-stone-700 transition active:scale-95"
              >
                <RotateCw className="h-4 w-4 text-emerald-800" />
                <span>Putar 90°</span>
              </button>

              <button
                onClick={() => setTransform((prev) => ({ ...prev, flipX: !prev.flipX }))}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border py-3 text-xs font-semibold transition active:scale-95 ${
                  transform.flipX
                    ? "border-emerald-700 bg-emerald-50 text-emerald-950"
                    : "border-stone-200/90 bg-stone-50/80 hover:bg-stone-100 text-stone-700"
                }`}
              >
                <FlipHorizontal className="h-4 w-4 text-emerald-800" />
                <span>Cermin</span>
              </button>

              <button
                onClick={() => setTransform(calculateInitialTransform(userImage))}
                className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-stone-200/90 bg-stone-50/80 hover:bg-stone-100 py-3 text-xs font-semibold text-stone-700 transition active:scale-95"
              >
                <RotateCcw className="h-4 w-4 text-stone-400" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <button
            disabled={isGenerating}
            onClick={handleFinalGenerate}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-royal hover:bg-royal-800 py-4 text-sm font-semibold text-white shadow-card transition-all duration-300 hover:shadow-card-hover active:scale-[0.98] disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Memproses Twibbon...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Selesai & Buat Twibbon</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
