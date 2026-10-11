"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Sparkles } from "lucide-react";

export default function AIScanningPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/diagnose/result");
    }, 2200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-slate-900 text-white min-h-screen flex flex-col justify-between py-8 font-sans">
      <div className="space-y-2 text-center pt-4">
        <div className="inline-flex items-center gap-1.5 bg-[#FF4D1A]/20 text-[#FF4D1A] px-3 py-1 rounded-full text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> AI Vision Engine
        </div>
        <h1 className="text-xl font-extrabold">Analyzing Vehicle Part...</h1>
        <p className="text-xs text-slate-400">Comparing OEM numbers & visual vectors</p>
      </div>

      {/* Camera View Finder Box */}
      <div className="relative w-full h-80 bg-slate-800 border-2 border-dashed border-[#FF4D1A] rounded-2xl overflow-hidden flex items-center justify-center my-auto shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF4D1A]/10 via-transparent to-[#FF4D1A]/10 animate-pulse" />
        <div className="relative z-10 text-center space-y-3">
          <div className="w-16 h-16 bg-[#FF4D1A] text-white rounded-2xl flex items-center justify-center mx-auto animate-bounce shadow-lg">
            <Eye className="w-8 h-8" />
          </div>
          <p className="text-xs text-slate-300 font-mono tracking-wide">
            Identifying OEM Specs...
          </p>
        </div>
      </div>

      {/* Loading Shimmer Bar */}
      <div className="space-y-2 pb-6">
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div className="bg-[#FF4D1A] h-full w-3/4 animate-pulse rounded-full" />
        </div>
        <p className="text-[11px] text-center text-slate-400 font-mono">
          94% Confidence vector match found
        </p>
      </div>
    </main>
  );
}
