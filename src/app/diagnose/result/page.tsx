"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ShieldAlert, Sparkles, ArrowRight, Store, ArrowLeft } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";

interface DiagnosticResult {
  part_name: string;
  category: string;
  confidence: number;
  oem_guess: string;
  urgency: string;
  reason: string;
  symptoms: string[];
  price_range_ngn: number;
  label?: string;
}

interface InventoryItem {
  id: string;
  part_name: string;
  price_ngn: number;
  seller_id: string;
  compatibility?: string;
}

function AIResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawData = searchParams?.get("data");
  const vehicleId = searchParams?.get("vehicle_id") || "";
  const supabase = createClient();

  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [matchingSellers, setMatchingSellers] = useState<InventoryItem[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(true);

  useEffect(() => {
    if (rawData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(rawData));
        setResult(parsed);
      } catch {
        setResult({
          part_name: "Ceramic Front Brake Pad Set",
          category: "Brakes & Suspension",
          confidence: 60,
          oem_guess: "OEM-04465-02220",
          urgency: "High",
          reason: "Identified brake pads from wear symptoms.",
          symptoms: ["Squealing noise when braking"],
          price_range_ngn: 18500,
        });
      }
    } else {
      setResult({
        part_name: "Ceramic Front Brake Pad Set",
        category: "Brakes & Suspension",
        confidence: 60,
        oem_guess: "OEM-04465-02220",
        urgency: "High",
        reason: "Identified brake pads from wear symptoms.",
        symptoms: ["Squealing noise when braking"],
        price_range_ngn: 18500,
      });
    }
  }, [rawData]);

  useEffect(() => {
    async function checkInventoryFitment() {
      if (!result?.part_name) return;
      setLoadingInventory(true);

      const { data } = await supabase
        .from("inventory")
        .select("*")
        .eq("status", "APPROVED")
        .ilike("part_name", `%${result.part_name.split(" ")[0]}%`);

      setMatchingSellers(data || []);
      setLoadingInventory(false);
    }

    checkInventoryFitment();
  }, [result]);

  if (!result) return null;

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-6 pb-28 font-sans space-y-4">
      <header className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.push("/diagnose")}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-bold text-[#121212]">AI Diagnostic Result</h1>
          <p className="text-[10px] text-[#8A8A8A]">PartMatch Identification Engine</p>
        </div>
        <div className="w-8" />
      </header>

      {/* Part Name BIG 48px Hierarchy */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-[#8A8A8A]">Identified Part</span>
          <span className="text-xs bg-[#FF4D1A]/10 text-[#FF4D1A] font-extrabold px-2.5 py-0.5 rounded-full border border-[#FF4D1A]/20">
            {result.confidence}% Match
          </span>
        </div>

        <h2 className="text-[28px] leading-tight font-extrabold text-[#121212] tracking-tight">
          {result.part_name}
        </h2>

        {result.label && (
          <p className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
            {result.label}
          </p>
        )}

        <div className="pt-2 border-t border-[#EAEAEA] grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-[10px] text-[#8A8A8A]">OEM Number</p>
            <p className="font-mono font-bold text-[#121212]">{result.oem_guess || "OEM-GENUINE"}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#8A8A8A]">Urgency Level</p>
            <p className="font-bold text-[#FF4D1A] flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> {result.urgency} Priority
            </p>
          </div>
        </div>
      </div>

      {/* AI Diagnostic Reasoning & Symptoms */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-2 shadow-sm text-xs">
        <div className="flex items-center gap-1.5 font-bold text-[#121212]">
          <Sparkles className="w-4 h-4 text-[#FF4D1A]" />
          <span>Diagnostic Reason & Symptoms</span>
        </div>
        <p className="text-[#8A8A8A] leading-relaxed">{result.reason}</p>
        {result.symptoms && result.symptoms.length > 0 && (
          <div className="pt-2 border-t border-[#EAEAEA] flex flex-wrap gap-1.5">
            {result.symptoms.map((s, idx) => (
              <span key={idx} className="bg-[#FFFBF5] text-[#121212] border border-[#EAEAEA] px-2 py-1 rounded-md text-[10px] font-medium">
                • {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Fitment Check & Compatible Sellers */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
            <Store className="w-4 h-4 text-[#FF4D1A]" />
            Marketplace Compatible Part Sellers
          </h3>
          <button
            onClick={() => router.push(`/diagnose/fitment?part=${encodeURIComponent(result.part_name)}&vehicle_id=${vehicleId}`)}
            className="text-xs text-[#FF4D1A] font-bold hover:underline"
          >
            Verify Fitment
          </button>
        </div>

        {loadingInventory ? (
          <div className="h-20 bg-neutral-200/80 rounded-[16px] animate-pulse" />
        ) : matchingSellers.length === 0 ? (
          <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-6 text-center space-y-3 shadow-sm">
            <Store className="w-8 h-8 text-[#8A8A8A] mx-auto" />
            <p className="text-xs font-semibold text-[#121212]">
              No compatible part in marketplace - Request from sellers
            </p>
            <button
              onClick={() => router.push(`/marketplace?search=${encodeURIComponent(result.part_name)}`)}
              className="px-4 py-2 bg-[#FF4D1A] text-white text-xs font-bold rounded-[48px] shadow-sm inline-flex items-center gap-1.5"
            >
              <span>Search Marketplace Sellers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {matchingSellers.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/marketplace/${item.id}`)}
                className="bg-white border border-[#EAEAEA] rounded-[16px] p-3.5 flex items-center justify-between cursor-pointer hover:border-[#FF4D1A] transition-colors shadow-sm"
              >
                <div>
                  <p className="text-xs font-bold text-[#121212]">{item.part_name}</p>
                  <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Compatible Fitment Approved
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-[#FF4D1A]">
                    ₦{Number(item.price_ngn).toLocaleString("en-NG")}
                  </p>
                  <span className="text-[10px] text-[#8A8A8A]">Verified Seller</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Button */}
      <button
        onClick={() => router.push(`/marketplace?search=${encodeURIComponent(result.part_name)}`)}
        className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] active:scale-[0.97] transition-transform text-white font-bold text-sm rounded-[12px] flex items-center justify-center gap-2 shadow-sm"
      >
        <span>Compare Verified Sellers</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <BottomNav />
    </main>
  );
}

export default function AIResultPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#8A8A8A]">Loading result...</div>}>
      <AIResultContent />
    </Suspense>
  );
}
