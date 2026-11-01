"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TwibbonEditor from "@/components/TwibbonEditor";
import ResultView from "@/components/ResultView";
import EventDetailsModal from "@/components/EventDetailsModal";
import Footer from "@/components/Footer";
import AudioPlayer from "@/components/AudioPlayer";
import { AppStep } from "@/types/twibbon";
import { getTwibbonFrame, loadImage } from "@/lib/canvas";

export default function HomePage() {
  const [step, setStep] = useState<AppStep>("landing");
  const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null);
  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultDataUrl, setResultDataUrl] = useState<string>("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Preload Twibbon Frame on mount
  useEffect(() => {
    getTwibbonFrame()
      .then((img) => setFrameImage(img))
      .catch((err) => console.error("Failed to load twibbon frame:", err));
  }, []);

  const triggerFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const objectUrl = URL.createObjectURL(file);
      const [loadedUserImg, loadedFrameImg] = await Promise.all([
        loadImage(objectUrl),
        frameImage ? Promise.resolve(frameImage) : getTwibbonFrame(),
      ]);

      setFrameImage(loadedFrameImg);
      setUserImage(loadedUserImg);
      setStep("editor");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Gagal memuat foto:", err);
      alert("Format foto tidak didukung. Silakan pilih file gambar lain.");
    }
  };

  const handleGenerateComplete = (blob: Blob, dataUrl: string) => {
    setResultBlob(blob);
    setResultDataUrl(dataUrl);
    setStep("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2]">
      {/* Hidden Gallery Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <Navbar />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {step === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <Hero
                onTriggerUpload={triggerFilePicker}
                onOpenInfo={() => setIsInfoOpen(true)}
              />
            </motion.div>
          )}

          {step === "editor" && userImage && frameImage && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <TwibbonEditor
                userImage={userImage}
                frameImage={frameImage}
                onBack={() => setStep("landing")}
                onChangePhoto={triggerFilePicker}
                onGenerate={handleGenerateComplete}
              />
            </motion.div>
          )}

          {step === "result" && resultBlob && resultDataUrl && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              <ResultView
                resultBlob={resultBlob}
                resultDataUrl={resultDataUrl}
                onEditAgain={() => setStep("editor")}
                onNewPhoto={triggerFilePicker}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <EventDetailsModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        onTriggerUpload={triggerFilePicker}
      />

      <AudioPlayer />

      <Footer />
    </div>
  );
}
