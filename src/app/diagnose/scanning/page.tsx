"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Scan, Sparkles, Clock } from "lucide-react";

function ScanningContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const vehicleId = searchParams?.get("vehicle_id") || "";
  const method = searchParams?.get("method") || "camera";
  const description = searchParams?.get("description") || "";

  const [watTime, setWatTime] = useState<string>("");

  useEffect(() => {
    const nowWAT = new Date().toLocaleTimeString("en-NG", {
      timeZone: "Africa/Lagos",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) + " WAT";
    setWatTime(nowWAT);

    async function runDiagnosis() {
      try {
        const res = await fetch("/api/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description,
            vehicle_id: vehicleId,
            method,
          }),
        });

        const data = await res.json();
        const encodedData = encodeURIComponent(JSON.stringify(data));
        router.push(`/diagnose/result?data=${encodedData}&vehicle_id=${vehicleId}`);
      } catch {
        router.push(`/diagnose/result?vehicle_id=${vehicleId}`);
      }
    }

    const timer = setTimeout(() => {
      runDiagnosis();
    }, 1500);

    return () => clearTimeout(timer);
  }, [description, method, router, vehicleId]);

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#121212] min-h-screen font-sans flex flex-col justify-between py-8 text-white">
      <div className="space-y-4 text-center pt-8">
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#FF4D1A] bg-[#FF4D1A]/10 py-1 px-3 rounded-full w-fit mx-auto border border-[#FF4D1A]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PartMatch Vision AI Active</span>
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">AI is identifying part...</h1>
        <p className="text-xs text-[#8A8A8A] flex items-center justify-center gap-1">
          <Clock className="w-3.5 h-3.5 text-[#FF4D1A]" /> Timestamp: {watTime}
        </p>
      </div>

      {/* Camera Viewport Simulation Skeleton */}
      <div className="relative w-full aspect-square rounded-[24px] bg-neutral-900 border-2 border-[#FF4D1A]/40 overflow-hidden flex items-center justify-center my-6 shadow-2xl">
        <div className="absolute inset-x-0 h-1 bg-[#FF4D1A] shadow-[0_0_15px_#FF4D1A] animate-pulse" style={{ top: "45%" }} />

        <div className="text-center space-y-3 z-10 px-6">
          <Scan className="w-16 h-16 text-[#FF4D1A] mx-auto animate-spin" />
          <p className="text-xs font-mono text-neutral-300">
            Analyzing visual features & OEM part database...
          </p>
        </div>

        {/* Framing Corners */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#FF4D1A]" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#FF4D1A]" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#FF4D1A]" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#FF4D1A]" />
      </div>

      <div className="text-center space-y-2 pb-6">
        <p className="text-xs font-semibold text-neutral-400">
          Cross-checking against Nigerian marketplace inventories
        </p>
      </div>
    </main>
  );
}

export default function ScanningPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-white">Scanning...</div>}>
      <ScanningContent />
    </Suspense>
  );
}
