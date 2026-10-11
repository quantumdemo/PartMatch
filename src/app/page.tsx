"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Wrench } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SplashScreenPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.replace("/onboarding");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role, kyc_status, pin_hash, bank_verified")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (!profile || !profile.role) {
          router.replace("/onboarding");
        } else if (profile.kyc_status !== "VERIFIED") {
          router.replace("/onboarding/kyc");
        } else if (!profile.pin_hash) {
          router.replace("/onboarding/pin");
        } else if (!profile.bank_verified && profile.role !== "R-01" && profile.role !== "buyer") {
          router.replace("/onboarding/bank");
        } else {
          router.replace("/dashboard");
        }
      } catch (err) {
        console.error("Splash redirect error:", err);
        router.replace("/onboarding");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, supabase]);

  return (
    <main className="min-h-screen bg-[#FFFBF5] dark:bg-neutral-950 text-[#121212] dark:text-white flex flex-col items-center justify-between p-6 select-none font-sans">
      <div />

      {/* Centered Brand Emblem */}
      <div className="flex flex-col items-center text-center space-y-4 animate-fade-in">
        <div className="relative">
          <div className="w-24 h-24 bg-[#FF4D1A] rounded-[24px] shadow-xl flex items-center justify-center transform transition-transform hover:scale-105 active:scale-95">
            <div className="relative flex items-center justify-center">
              <span className="font-mono font-black text-3xl text-white tracking-tighter">PM</span>
              <Wrench className="w-6 h-6 text-white absolute -top-1 -right-2 transform rotate-45" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#121212] dark:bg-neutral-800 rounded-full border-2 border-[#FFFBF5] dark:border-neutral-950 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">NG</span>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-[#121212] dark:text-white">
            PartMatch
          </h1>
          <p className="text-xs font-medium text-[#8A8A8A] max-w-[240px]">
            Spare Parts Marketplace • AI Diagnosis • Escrow Guarantee
          </p>
        </div>
      </div>

      {/* Bottom Loading Indicator */}
      <div className="flex flex-col items-center space-y-3 pb-8">
        <div className="w-6 h-6 border-2 border-[#FF4D1A] border-t-transparent rounded-full animate-spin" />
        <p className="text-[11px] font-mono font-semibold text-[#8A8A8A]">
          Nigeria Spare Parts Marketplace
        </p>
      </div>
    </main>
  );
}
