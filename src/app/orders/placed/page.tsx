"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, ArrowRight, Package } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export default function OrderPlacedPage() {
  const now = new Date();
  const releaseDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
  const formatWAT = `${releaseDate.getDate()} Oct ${releaseDate.getFullYear()}, ${releaseDate.getHours()}:${releaseDate.getMinutes()} WAT`;

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-10 pb-24 font-sans text-center space-y-6">
      {/* Success Animation Container */}
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
          Payment Secured in Escrow
        </span>
        <h1 className="text-2xl font-extrabold text-[#121212] pt-2">Order Placed Successfully!</h1>
        <p className="text-xs text-[#8A8A8A]">Reference: PM-REF-20261011-829A</p>
      </div>

      {/* Escrow Details Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 text-left shadow-sm text-xs">
        <div className="flex justify-between border-b border-[#EAEAEA] pb-2 font-bold text-[#121212]">
          <span>Amount Locked in Escrow</span>
          <span className="font-mono text-[#FF4D1A]">₦18,500 NGN</span>
        </div>

        <div className="space-y-1.5 text-[#8A8A8A]">
          <div className="flex justify-between">
            <span>72-Hour Release Expiry:</span>
            <span className="font-mono text-[#121212]">{formatWAT}</span>
          </div>
          <div className="flex justify-between">
            <span>Merchant Dispatch Status:</span>
            <span className="font-bold text-emerald-700">Awaiting Dispatch Notification</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-[16px] text-xs text-emerald-900 text-left space-y-1">
        <div className="font-bold text-emerald-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Buyer Protection Active
        </div>
        <p className="text-[11px] text-emerald-700 leading-relaxed">
          The merchant will pack and dispatch your part. Funds remain safely locked in escrow until you verify delivery and installation.
        </p>
      </div>

      <Link
        href="/cart"
        className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white font-bold text-xs rounded-[12px] shadow-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
      >
        <Package className="w-4 h-4" /> Track Order Delivery & Escrow <ArrowRight className="w-4 h-4" />
      </Link>

      <BottomNav />
    </main>
  );
}
