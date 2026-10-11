"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { RoleKYCForm } from "@/components/RoleKYCForm";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingKYCPage() {
  const [userId, setUserId] = useState<string>("123e4567-e89b-12d3-a456-426614174000");
  const [userRole, setUserRole] = useState<"buyer" | "seller" | "mechanic">("buyer");
  const router = useRouter();

  useEffect(() => {
    async function loadUserAndRole() {
      if (typeof window !== "undefined") {
        const storedRole = localStorage.getItem("partmatch_selected_role");
        if (storedRole === "seller" || storedRole === "mechanic") {
          setUserRole(storedRole);
        } else {
          setUserRole("buyer");
        }
      }

      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) {
        setUserId(data.user.id);
      }
    }
    loadUserAndRole();
  }, []);

  return (
    <main className="min-h-screen bg-[#FFFBF5] text-[#0F172A] p-6 md:p-12 font-sans flex items-center justify-center">
      <div className="max-w-xl w-full space-y-6">
        <header className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF4D1A] bg-[#FF4D1A]/10 px-3 py-1 rounded-full mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Step 4 of 5: Role-Based KYC Documentation
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Submit Identity & Role Credentials</h1>
          <p className="text-xs text-[#64748B]">
            Upload required NIN, CAC, store photos, or mechanic certifications to lock your profile.
          </p>
        </header>

        <RoleKYCForm userId={userId} userRole={userRole} />

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => router.push("/onboarding/pin")}
            className="py-3 px-6 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-2 shadow-sm"
          >
            Proceed to Payment PIN Setup <ArrowRight className="w-4 h-4 text-[#FF4D1A]" />
          </button>
        </div>
      </div>
    </main>
  );
}
