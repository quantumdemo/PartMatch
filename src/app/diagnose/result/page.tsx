"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, ChevronRight, AlertCircle, Sparkles } from "lucide-react";

interface AiResultData {
  part_name: string;
  category: string;
  confidence: number;
  oem_guess: string;
  urgency: string;
  reason: string;
  symptoms: string[];
  price_range_ngn: number;
  label?: string;
  source?: string;
}

export default function DiagnosticResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<AiResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "squealing brake noise" }),
    })
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen py-10 font-sans text-center">
        <p className="text-xs text-[#8A8A8A]">Analyzing Diagnostic Scan with AI...</p>
      </main>
    );
  }

  if (!result) return null;

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-20 font-sans space-y-4">
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">AI Diagnosis Match</h1>
          <p className="text-[11px] text-[#8A8A8A]">
            {result.source === "openai" ? "OpenAI gpt-4o-mini Vision Result" : "Smart Keyword Match"}
          </p>
        </div>
      </header>

      {/* Confidence & Source Badge */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] bg-[#121212] text-white font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#FF4D1A]" />
            Match Confidence: {result.confidence}%
          </span>
          <span className="text-[10px] bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded border border-red-200">
            Urgency: {result.urgency}
          </span>
        </div>

        {result.label && (
          <p className="text-[11px] text-[#8A8A8A] font-medium bg-[#FFFBF5] p-2 rounded-lg border border-[#EAEAEA]">
            {result.label}
          </p>
        )}

        <div className="space-y-1">
          <p className="text-xs text-[#8A8A8A] uppercase font-bold tracking-wider">Identified Spare Part</p>
          <p className="text-[28px] font-extrabold text-[#121212] leading-tight">{result.part_name}</p>
          <p className="text-xs font-mono font-bold text-[#FF4D1A]">OEM: {result.oem_guess}</p>
        </div>
      </div>

      {/* Reason & Price Range */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm">
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#121212]">Diagnostic Reason</p>
          <p className="text-xs text-[#8A8A8A] leading-relaxed">{result.reason}</p>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-[12px] flex items-center justify-between text-xs text-amber-900 font-bold">
          <span>Estimated Market Price:</span>
          <span className="text-sm font-extrabold text-[#121212]">
            ₦{result.price_range_ngn.toLocaleString("en-NG")} NGN
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => router.push(`/diagnose/fitment?oem=${result.oem_guess}`)}
          className="w-full h-12 bg-white border border-[#EAEAEA] text-[#121212] text-xs font-bold rounded-[12px] flex items-center justify-between px-4 shadow-sm"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verify Garage Fitment 100%
          </span>
          <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
        </button>

        <button
          onClick={() => router.push(`/diagnose/search?q=${encodeURIComponent(result.part_name)}`)}
          className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
        >
          <span>Find Parts in Marketplace</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
}
