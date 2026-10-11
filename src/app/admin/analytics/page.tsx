"use client";

import React from "react";
import { TrendingUp, Store, Wrench } from "lucide-react";
import { InfoTooltip } from "@/components/InfoTooltip";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl font-bold text-[#121212]">Platform Performance Analytics</h1>
        <p className="text-xs text-[#8A8A8A]">GMV, Escrow Fees & Top Merchant Revenue Metrics</p>
      </div>

      {/* 48px GMV Display */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-6 space-y-2 shadow-sm">
        <span className="text-xs uppercase font-bold text-[#8A8A8A] tracking-wider flex items-center">
          Gross Merchandise Volume (GMV) <InfoTooltip id="nin" />
        </span>
        <p className="text-[48px] font-extrabold text-[#121212] leading-none tracking-tight">
          ₦2,480,000
        </p>
        <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> +24% growth in escrow purchases this month
        </p>
      </div>

      {/* Top Merchants & Mechanics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
          <h2 className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
            <Store className="w-4 h-4 text-[#FF4D1A]" /> Top Spare Part Merchants
          </h2>
          <div className="space-y-2 text-xs text-[#121212]">
            <div className="p-2.5 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA] flex justify-between">
              <span className="font-bold">Ladipo Auto Spares #12</span>
              <span className="font-extrabold text-[#FF4D1A]">₦1,240,000 NGN</span>
            </div>
            <div className="p-2.5 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA] flex justify-between">
              <span className="font-bold">Aspamda Trade Fair Hub</span>
              <span className="font-extrabold text-[#FF4D1A]">₦890,000 NGN</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
          <h2 className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-[#121212]" /> Top Mobile Mechanics (R-04)
          </h2>
          <div className="space-y-2 text-xs text-[#121212]">
            <div className="p-2.5 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA] flex justify-between">
              <span className="font-bold">Engr. Chidi Okafor</span>
              <span className="font-extrabold text-emerald-600">₦185,000 NGN (15%)</span>
            </div>
            <div className="p-2.5 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA] flex justify-between">
              <span className="font-bold">Ikeja Auto Mobile Mechanics</span>
              <span className="font-extrabold text-emerald-600">₦142,000 NGN (15%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
