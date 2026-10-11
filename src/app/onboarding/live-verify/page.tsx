"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { LiveVerificationCamera } from "@/components/LiveVerificationCamera";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingLiveVerifyPage() {
  const [userId, setUserId] = useState<string>("123e4567-e89b-12d3-a456-426614174000");
  const [verified, setVerified] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) {
        setUserId(data.user.id);
      }
    }
    loadUser();
  }, []);

  const handleVerified = () => {
    setVerified(true);
  };

  const handleProceed = () => {
    router.push("/onboarding/kyc");
  };

  return (
    <main className="min-h-screen bg-[#FFFBF5] text-[#0F172A] p-6 md:p-12 font-sans flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <header className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF4D1A] bg-[#FF4D1A]/10 px-3 py-1 rounded-full mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Step 3 of 5: Live Profile Verification
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Human Face Liveness Check</h1>
          <p className="text-xs text-[#64748B]">
            Capture a live selfie photo with blink detection to verify your profile picture.
          </p>
        </header>

        <LiveVerificationCamera userId={userId} onVerified={handleVerified} />

        {verified && (
          <button
            type="button"
            onClick={handleProceed}
            className="w-full py-3.5 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-sm font-extrabold rounded-xl transition shadow-sm flex items-center justify-center gap-2"
          >
            Verification Complete - Proceed to KYC <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </main>
  );
}
