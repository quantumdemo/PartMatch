"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wallet, ArrowUpRight, History, Wrench, User } from "lucide-react";

export default function MechanicWalletPage() {
  const router = useRouter();
  const [balance] = useState(12500);
  const [filter, setFilter] = useState("ALL");

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
          <h1 className="text-base font-bold text-[#121212]">Mechanic Payout Wallet</h1>
          <p className="text-[11px] text-[#8A8A8A]">OPay-Style Instant Bank Withdrawals</p>
        </div>
      </header>

      {/* 48px Balance Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
        <span className="text-[10px] uppercase font-bold text-[#8A8A8A] tracking-wider">
          Withdrawable Balance
        </span>

        <div className="flex items-baseline justify-between">
          <p className="text-[48px] font-extrabold text-[#121212] leading-none tracking-tight">
            ₦{balance.toLocaleString("en-NG")}
          </p>
        </div>

        <div className="pt-2 flex gap-2">
          <button
            onClick={() => router.push("/wallet/bank-accounts")}
            className="flex-1 h-12 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw to Bank</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 text-xs font-bold">
        {["ALL", "ESCROW", "CREDIT", "DEBIT"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-full border transition-colors ${
              filter === tab
                ? "bg-[#121212] text-white border-[#121212]"
                : "bg-white text-[#8A8A8A] border-[#EAEAEA]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Recent Mechanic Ledger Transactions */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2">
          <h2 className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-[#FF4D1A]" />
            Recent Job Earnings
          </h2>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">
            Verified
          </span>
        </div>

        <div className="space-y-2 text-xs text-[#121212]">
          <div className="p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] flex items-center justify-between">
            <div>
              <p className="font-bold text-[#121212]">Fitment Job #PM-REF-11111111</p>
              <p className="text-[10px] text-[#8A8A8A]">15% Escrow Split Payout</p>
            </div>
            <p className="text-xs font-extrabold text-emerald-600">+₦2,850</p>
          </div>

          <div className="p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] flex items-center justify-between">
            <div>
              <p className="font-bold text-[#121212]">Fitment Job #PM-REF-22222222</p>
              <p className="text-[10px] text-[#8A8A8A]">15% Escrow Split Payout</p>
            </div>
            <p className="text-xs font-extrabold text-emerald-600">+₦9,650</p>
          </div>
        </div>
      </div>

      {/* Mechanic Bottom Navigation */}
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
          className="flex flex-col items-center gap-1 text-[#FF4D1A]"
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
