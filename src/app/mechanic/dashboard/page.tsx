"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wrench,
  Wallet,
  User,
  Power,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Bell,
  Briefcase,
} from "lucide-react";
import { MechanicService, MechanicProfile } from "@/lib/services/mechanicService";

export default function MechanicDashboardPage() {
  const router = useRouter();
  const mechanicId = "mechanic-001";

  const [profile, setProfile] = useState<MechanicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    MechanicService.getMechanicProfile(mechanicId).then((data) => {
      setProfile(data);
      setLoading(false);
    });
  }, [mechanicId]);

  const handleToggleOnline = async () => {
    if (!profile) return;
    setToggling(true);
    const nextState = !profile.is_online;
    await MechanicService.toggleOnlineStatus(mechanicId, nextState);
    setProfile({ ...profile, is_online: nextState });
    setToggling(false);
  };

  if (loading || !profile) {
    return (
      <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen py-10 font-sans text-center">
        <p className="text-xs text-[#8A8A8A]">Loading Mechanic Portal...</p>
      </main>
    );
  }

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#FF4D1A] text-white rounded-full flex items-center justify-center font-bold text-sm">
            MC
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#121212]">Hi, Engr. Chidi</h1>
            <p className="text-[11px] text-[#8A8A8A] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> R-04 Verified Mechanic
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#121212]">
          <button className="p-2 rounded-xl bg-white border border-[#EAEAEA]">
            <HelpCircle className="w-4 h-4 text-[#8A8A8A]" />
          </button>
          <button className="p-2 rounded-xl bg-white border border-[#EAEAEA] relative">
            <Bell className="w-4 h-4 text-[#8A8A8A]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF4D1A] rounded-full" />
          </button>
        </div>
      </header>

      {/* Online / Offline Status Toggle Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 shadow-sm flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                profile.is_online ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"
              }`}
            />
            <p className="text-xs font-bold text-[#121212]">
              {profile.is_online ? "ONLINE (Dispatch Active)" : "OFFLINE (Not Receiving Jobs)"}
            </p>
          </div>
          <p className="text-[11px] text-[#8A8A8A]">
            {profile.is_online
              ? "Scanning 5km radius for fitment jobs"
              : "Toggle online to receive 15% escrow jobs"}
          </p>
        </div>

        <button
          onClick={handleToggleOnline}
          disabled={toggling}
          className={`px-4 py-2.5 rounded-[12px] font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-[0.97] ${
            profile.is_online
              ? "bg-emerald-500 text-white shadow-sm"
              : "bg-neutral-200 text-neutral-700"
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{profile.is_online ? "ON" : "OFF"}</span>
        </button>
      </div>

      {/* Today's Earnings with 48px Typography */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-2 shadow-sm">
        <span className="text-[10px] uppercase font-bold text-[#8A8A8A] tracking-wider">
          Today&apos;s Payout Earnings
        </span>

        <div className="flex items-baseline justify-between">
          <p className="text-[48px] font-extrabold text-[#121212] leading-none tracking-tight">
            ₦{profile.today_earnings.toLocaleString("en-NG")}
          </p>
        </div>

        <p className="text-xs text-[#8A8A8A]">
          Cumulative 15% mechanic fee payouts from confirmed fitment jobs.
        </p>
      </div>

      {/* Navigation Quick Actions */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => router.push("/mechanic/jobs")}
          className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-between px-4 shadow-sm active:scale-[0.98] transition-transform"
        >
          <span className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-white" />
            View Available Nearby Jobs
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => router.push("/mechanic/wallet")}
          className="w-full h-12 bg-white border border-[#EAEAEA] text-[#121212] text-xs font-bold rounded-[12px] flex items-center justify-between px-4 shadow-sm"
        >
          <span className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#FF4D1A]" />
            Mechanic Wallet & Withdrawals
          </span>
          <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
        </button>
      </div>

      {/* Mechanic Specific Bottom Navigation (Jobs | Wallet | Me) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto bg-white border-t border-[#EAEAEA] h-16 flex items-center justify-around z-50">
        <button
          onClick={() => router.push("/mechanic/jobs")}
          className="flex flex-col items-center gap-1 text-[#FF4D1A]"
        >
          <Wrench className="w-5 h-5" />
          <span className="text-[10px] font-bold">Jobs</span>
        </button>

        <button
          onClick={() => router.push("/mechanic/wallet")}
          className="flex flex-col items-center gap-1 text-[#8A8A8A]"
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] font-bold">Wallet</span>
        </button>

        <button
          onClick={() => router.push("/mechanic/dashboard")}
          className="flex flex-col items-center gap-1 text-[#8A8A8A]"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">Me</span>
        </button>
      </nav>
    </main>
  );
}
