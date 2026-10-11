"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wrench,
  ShieldCheck,
  Lock,
  LogOut,
  Power,
  MapPin,
  Award,
  Wallet,
  User,
} from "lucide-react";
import { MechanicService, MechanicProfile } from "@/lib/services/mechanicService";
import { InfoTooltip } from "@/components/InfoTooltip";

export default function MechanicProfilePage() {
  const router = useRouter();
  const mechanicId = "mechanic-001";

  const [profile, setProfile] = useState<MechanicProfile | null>(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    MechanicService.getMechanicProfile(mechanicId).then((data) => {
      setProfile(data);
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

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      document.cookie = "partmatch_user_role=; path=/; max-age=0;";
      localStorage.removeItem("partmatch_user_role");
    }
    router.push("/onboarding");
  };

  if (!profile) return null;

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      {/* Header */}
      <header className="border-b border-[#EAEAEA] pb-3">
        <h1 className="text-base font-bold text-[#121212]">Mechanic Profile & Settings (Me)</h1>
        <p className="text-[11px] text-[#8A8A8A]">R-04 Mobile Mechanic Authorization</p>
      </header>

      {/* Hero Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-[#FF4D1A] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-sm">
            <Wrench className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-[#121212]">Engr. Chidi Okafor</h2>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
              R-04 Verified Mechanic • Live Verified
            </span>
          </div>
        </div>
      </div>

      {/* Duplicate Dispatch Status Toggle */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 flex items-center justify-between shadow-sm">
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-[#121212]">Dispatch Availability</p>
          <p className="text-[11px] text-[#8A8A8A]">
            {profile.is_online ? "Online & scanning for job dispatches" : "Offline"}
          </p>
        </div>

        <button
          onClick={handleToggleOnline}
          disabled={toggling}
          className={`px-3 py-2 rounded-[12px] font-bold text-xs flex items-center gap-1.5 ${
            profile.is_online ? "bg-emerald-500 text-white" : "bg-neutral-200 text-neutral-700"
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{profile.is_online ? "ON" : "OFF"}</span>
        </button>
      </div>

      {/* Locked Trade Cert & Workshop Registration Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2">
          <h3 className="text-xs font-bold text-[#121212] flex items-center">
            Trade & GPS Verification <InfoTooltip id="kyc" />
          </h3>
          <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Locked
          </span>
        </div>

        <div className="space-y-2 text-xs text-[#121212]">
          <div className="flex items-center justify-between p-2.5 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA]">
            <span className="text-[#8A8A8A] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#121212]" /> Trade Certificate
            </span>
            <span className="font-mono font-bold">CERT-NG-88910</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA]">
            <span className="text-[#8A8A8A] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF4D1A]" /> Registered Workshop
            </span>
            <span className="font-bold">{profile.formatted_address}</span>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <button
        onClick={handleLogout}
        className="w-full h-12 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out Mechanic Account</span>
      </button>

      {/* Mechanic Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto bg-white border-t border-[#EAEAEA] h-16 flex items-center justify-around z-50">
        <button
          onClick={() => router.push("/mechanic/jobs")}
          className="flex flex-col items-center gap-1 text-[#8A8A8A]"
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
          onClick={() => router.push("/mechanic/me")}
          className="flex flex-col items-center gap-1 text-[#FF4D1A]"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">Me</span>
        </button>
      </nav>
    </main>
  );
}
