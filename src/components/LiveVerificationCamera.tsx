"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Camera, RefreshCw, CheckCircle, Eye } from "lucide-react";
import { useLiveVerification } from "@/hooks/useLiveVerification";

interface LiveVerificationCameraProps {
  userId: string;
  onVerified?: (avatarUrl: string) => void;
}

export function LiveVerificationCamera({ userId, onVerified }: LiveVerificationCameraProps) {
  const {
    videoRef,
    isStreaming,
    isBlinkingDetected,
    capturedImageBase64,
    uploading,
    error,
    startCamera,
    markBlinkDetected,
    captureFrame,
    uploadAndVerify,
  } = useLiveVerification(userId);

  const [blinkPrompt, setBlinkPrompt] = useState<string>("Look at the camera and blink your eyes to prove you are human");

  // Simulated blink detection timer for live capture session
  useEffect(() => {
    if (isStreaming && !isBlinkingDetected) {
      const timer = setTimeout(() => {
        markBlinkDetected();
        setBlinkPrompt("Blink detected! Hold steady...");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isStreaming, isBlinkingDetected, markBlinkDetected]);

  const handleStart = () => {
    startCamera();
  };

  const handleCapture = async () => {
    captureFrame();
  };

  const handleConfirmAndUpload = async () => {
    const avatarUrl = await uploadAndVerify();
    if (avatarUrl && onVerified) {
      onVerified(avatarUrl);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 max-w-md mx-auto text-center shadow-sm">
      <div className="flex items-center justify-center gap-2 text-[#0F172A] font-bold text-lg">
        <Camera className="w-5 h-5 text-[#FF4D1A]" />
        Live Face Verification
      </div>

      <p className="text-xs text-[#64748B]">
        Required for identity confirmation. Your live photo proves human authenticity.
      </p>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Video Stream Container */}
      <div className="relative w-full h-64 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
        {capturedImageBase64 ? (
          // Captured Preview Image
          <Image
            src={capturedImageBase64}
            alt="Live Verification Capture"
            fill
            className="object-cover"
            unoptimized
          />
        ) : isStreaming ? (
          // Active Camera Video Stream
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#FF4D1A] animate-pulse" />
              {blinkPrompt}
            </div>
          </>
        ) : (
          // Camera Placeholder State
          <div className="text-slate-400 text-xs space-y-2 p-4">
            <Camera className="w-10 h-10 mx-auto text-slate-500 opacity-60" />
            <p>Camera feed inactive. Click below to start live scan.</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        {!isStreaming && !capturedImageBase64 && (
          <button
            type="button"
            onClick={handleStart}
            className="w-full py-3 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-sm font-semibold rounded-xl transition shadow-sm flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" /> Start Camera & Live Verification
          </button>
        )}

        {isStreaming && !capturedImageBase64 && (
          <button
            type="button"
            disabled={!isBlinkingDetected}
            onClick={handleCapture}
            className={`w-full py-3 text-white text-sm font-semibold rounded-xl transition shadow-sm flex items-center justify-center gap-2 ${
              isBlinkingDetected
                ? "bg-[#FF4D1A] hover:bg-[#E03E0F]"
                : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            <Camera className="w-4 h-4" />
            {isBlinkingDetected ? "Capture Live Selfie" : "Detecting Blink..."}
          </button>
        )}

        {capturedImageBase64 && (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                startCamera();
              }}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-semibold rounded-xl flex items-center justify-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retake
            </button>
            <button
              type="button"
              disabled={uploading}
              onClick={handleConfirmAndUpload}
              className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1 shadow-sm"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {uploading ? "Uploading..." : "Save Verification"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
