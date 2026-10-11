"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, ArrowUpRight, History, ArrowLeft, Lock } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export default function CustomerWalletPage() {
  const router = useRouter();
  const [balance] = useState(45000);
  const [escrowBalance] = useState(18500);

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">Customer PartMatch Wallet</h1>
          <p className="text-[11px] text-[#8A8A8A]">OPay-Style Instant Funding & Escrow</p>
        </div>
      </header>

      {/* 48px Withdrawable Balance Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
        <span className="text-[10px] uppercase font-bold text-[#8A8A8A] tracking-wider">
          Withdrawable Balance
        </span>

        <div className="flex items-baseline justify-between">
          <p className="text-[48px] font-extrabold text-[#121212] leading-none tracking-tight">
            ₦{balance.toLocaleString("en-NG")}
          </p>
        </div>

        {/* Locked Escrow Balance Banner */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-[12px] flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-1.5 font-bold">
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>Escrow Locked Balance:</span>
          </div>
          <span className="font-extrabold">₦{escrowBalance.toLocaleString("en-NG")} NGN</span>
        </div>

        <div className="pt-2 flex gap-2">
          <button
            onClick={() => router.push("/checkout/pay")}
            className="flex-1 h-12 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Funds (Paystack)</span>
          </button>

          <button
            onClick={() => router.push("/wallet/bank-accounts")}
            className="flex-1 h-12 bg-white border border-[#EAEAEA] text-[#121212] text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ArrowUpRight className="w-4 h-4 text-[#FF4D1A]" />
            <span>Withdraw to Bank</span>
          </button>
        </div>
      </div>

      {/* Ledger Immutable Transactions History */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2">
          <h2 className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-[#FF4D1A]" />
            Immutable Transaction Ledger
          </h2>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">
            Audited
          </span>
        </div>

        <div className="space-y-2 text-xs text-[#121212]">
          <div className="p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] flex items-center justify-between">
            <div>
              <p className="font-bold text-[#121212]">Wallet Funding via Paystack</p>
              <p className="text-[10px] text-[#8A8A8A]">Ref: PM-REF-88910023</p>
            </div>
            <p className="text-xs font-extrabold text-emerald-600">+₦50,000</p>
          </div>

          <div className="p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] flex items-center justify-between">
            <div>
              <p className="font-bold text-[#121212]">Escrow Lock for Order PM-REF-11111111</p>
              <p className="text-[10px] text-[#8A8A8A]">Toyota Brake Pads Purchase</p>
            </div>
            <p className="text-xs font-extrabold text-amber-700">-₦18,500</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
