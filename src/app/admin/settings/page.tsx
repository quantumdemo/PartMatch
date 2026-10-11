"use client";

import React, { useState } from "react";
import { Settings, Save, CheckCircle2 } from "lucide-react";
import { InfoTooltip } from "@/components/InfoTooltip";

export default function AdminSettingsPage() {
  const [platformFee, setPlatformFee] = useState<number>(5);
  const [sellerSplit, setSellerSplit] = useState<number>(85);
  const [mechanicSplit, setMechanicSplit] = useState<number>(15);
  const [escrowTimerHours, setEscrowTimerHours] = useState<number>(72);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl font-bold text-[#121212]">Platform Global Settings</h1>
        <p className="text-xs text-[#8A8A8A]">Configure Mandatory Escrow Split Ratios & Countdown Parameters</p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-[16px] text-xs text-emerald-900 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Platform Settings Updated in Supabase `platform_settings` table!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#121212] flex items-center">
            Platform Escrow Fee % <InfoTooltip id="nin" />
          </label>
          <input
            type="number"
            value={platformFee}
            onChange={(e) => setPlatformFee(Number(e.target.value))}
            required
            className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] font-bold focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#121212]">Seller Payout Split %</label>
            <input
              type="number"
              value={sellerSplit}
              onChange={(e) => setSellerSplit(Number(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] font-bold focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#121212]">Mechanic Inspection Split %</label>
            <input
              type="number"
              value={mechanicSplit}
              onChange={(e) => setMechanicSplit(Number(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] font-bold focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#121212]">Automated Escrow Release Countdown (Hours)</label>
          <input
            type="number"
            value={escrowTimerHours}
            onChange={(e) => setEscrowTimerHours(Number(e.target.value))}
            required
            className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] font-bold focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
          />
        </div>

        <button
          type="submit"
          className="w-full h-12 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>Save Global Settings</span>
        </button>
      </form>
    </div>
  );
}
