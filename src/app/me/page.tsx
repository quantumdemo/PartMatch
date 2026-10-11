"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { User, ShieldCheck, Lock, LogOut, HelpCircle, Settings, ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { InfoTooltip } from "@/components/InfoTooltip";

export default function CustomerProfilePage() {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      document.cookie = "partmatch_user_role=; path=/; max-age=0;";
      localStorage.removeItem("partmatch_user_role");
    }
    router.push("/onboarding");
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      {/* Header */}
      <header className="border-b border-[#EAEAEA] pb-3">
        <h1 className="text-base font-bold text-[#121212]">Account & Profile (Me)</h1>
        <p className="text-[11px] text-[#8A8A8A]">KYC Status & Security Settings</p>
      </header>

      {/* User Hero Avatar Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-[#FF4D1A] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-sm">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-[#121212]">Tunde Oladipo</h2>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
              R-01 Driver • Live KYC Verified
            </span>
          </div>
        </div>
      </div>

      {/* Locked KYC Profile Information Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2">
          <h3 className="text-xs font-bold text-[#121212] flex items-center">
            KYC Verified Info <InfoTooltip id="kyc" />
          </h3>
          <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Locked
          </span>
        </div>

        <div className="space-y-2 text-xs text-[#121212]">
          <div className="flex items-center justify-between p-2.5 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA]">
            <span className="text-[#8A8A8A] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#121212]" /> Phone Number
            </span>
            <span className="font-mono font-bold">+234 803 *** 8812</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA]">
            <span className="text-[#8A8A8A] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#121212]" /> Email Address
            </span>
            <span className="font-mono font-bold">tunde.driver@gmail.com</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA]">
            <span className="text-[#8A8A8A] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF4D1A]" /> Primary Address
            </span>
            <span className="font-bold">Ikeja, Lagos, WAT</span>
          </div>
        </div>
      </div>

      {/* Account Settings List */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-2 shadow-sm">
        <p className="text-xs font-bold text-[#121212]">Security & Support</p>

        <button
          onClick={() => router.push("/onboarding/pin")}
          className="w-full p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] flex items-center justify-between text-xs font-bold text-[#121212]"
        >
          <span className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#FF4D1A]" /> Change 4-Digit Payment PIN
          </span>
          <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
        </button>

        <button className="w-full p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] flex items-center justify-between text-xs font-bold text-[#121212]">
          <span className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#8A8A8A]" /> Help & Dispute Support Center
          </span>
          <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
        </button>
      </div>

      {/* Logout Action */}
      <button
        onClick={handleLogout}
        className="w-full h-12 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out Account</span>
      </button>

      <BottomNav />
    </main>
  );
}
