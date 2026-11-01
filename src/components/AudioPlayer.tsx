"use client";

import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5; // Ditanam di volume 50%

    // 1. Coba langsung play saat halaman dimuat
    const tryAutoplay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        // Autoplay diblokir oleh browser sebelum ada gestur sentuh/klik
        setIsPlaying(false);
      }
    };

    tryAutoplay();

    // 2. Begitu user melakukan sentuhan pertama (scroll, tap, click, pointerdown)
    // audio langsung otomatis diputar pada 50% volume
    const triggerAudioOnGesture = () => {
      if (audio.paused) {
        audio.volume = 0.5;
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsMuted(false);
          })
          .catch(() => {});
      }
      removeGestureListeners();
    };

    const removeGestureListeners = () => {
      document.removeEventListener("pointerdown", triggerAudioOnGesture);
      document.removeEventListener("touchstart", triggerAudioOnGesture);
      document.removeEventListener("click", triggerAudioOnGesture);
      document.removeEventListener("scroll", triggerAudioOnGesture, true);
    };

    document.addEventListener("pointerdown", triggerAudioOnGesture, { passive: true, once: true });
    document.addEventListener("touchstart", triggerAudioOnGesture, { passive: true, once: true });
    document.addEventListener("click", triggerAudioOnGesture, { passive: true, once: true });
    document.addEventListener("scroll", triggerAudioOnGesture, { passive: true, once: true });

    return () => {
      removeGestureListeners();
    };
  }, []);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused || isMuted) {
      audio.muted = false;
      audio.volume = 0.5;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
      setIsMuted(true);
    }
  };

  return (
    <>
      {/* Audio Element Tanem Volume 50% */}
      <audio
        ref={audioRef}
        src="/musik.mp3"
        loop
        preload="auto"
        playsInline
      />

      {/* Toggle Mute Statis di Pojok Kanan Bawah */}
      <div className="fixed bottom-5 right-5 z-40 select-none">
        <button
          onClick={toggleAudio}
          type="button"
          className="group flex h-11 items-center gap-2 rounded-full border border-stone-200/90 bg-white/95 px-3 shadow-card backdrop-blur-md transition-colors hover:bg-stone-50 active:scale-95 focus:outline-none"
          title={isPlaying && !isMuted ? "Matikan Musik Latar" : "Putar Musik Latar (50%)"}
          aria-label={isPlaying && !isMuted ? "Matikan Musik Latar" : "Putar Musik Latar (50%)"}
        >
          {isPlaying && !isMuted ? (
            <>
              <Volume2 className="h-4 w-4 text-emerald-800" />
              <span className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-full bg-emerald-700 animate-pulse" />
                <span className="w-0.5 h-2 bg-emerald-700 animate-pulse delay-75" />
                <span className="w-0.5 h-3 bg-emerald-700 animate-pulse delay-150" />
              </span>
            </>
          ) : (
            <>
              <VolumeX className="h-4 w-4 text-stone-400" />
              <span className="text-[11px] font-semibold text-stone-500">Musik</span>
            </>
          )}
        </button>
      </div>
    </>
  );
}

