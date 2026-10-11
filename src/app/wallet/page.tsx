"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, ArrowUpRight, History, ArrowLeft, Lock } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { WalletService, WalletBalanceInfo, WalletTransaction } from "@/lib/services/walletService";

export default function CustomerWalletPage() {
  const router = useRouter();
  const userId = "123e4567-e89b-12d3-a456-426614174000";

  const [balances, setBalances] = useState<WalletBalanceInfo | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchWallet = useCallback(async () => {
    setLoading(true);
    const [bal, txs] = await Promise.all([
      WalletService.getWalletBalance(userId),
      WalletService.getTransactions(userId, filter),
    ]);
    setBalances(bal);
    setTransactions(txs);
    setLoading(false);
  }, [userId, filter]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  if (loading || !balances) {
    return (
      <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen py-10 font-sans text-center">
        <p className="text-xs text-[#8A8A8A]">Loading Customer Wallet...</p>
      </main>
    );
  }

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
          <h1 className="text-base font-bold text-[#121212]">Customer Wallet</h1>
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
            ₦{balances.available_balance.toLocaleString("en-NG")}
          </p>
        </div>

        {/* Locked Escrow Balance Banner */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-[12px] flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-1.5 font-bold">
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>Escrow Locked Balance:</span>
          </div>
          <span className="font-extrabold">₦{balances.escrow_balance.toLocaleString("en-NG")} NGN</span>
        </div>

        <div className="pt-2 flex gap-2">
          <button
            onClick={() => router.push("/checkout/pay")}
            className="flex-1 h-12 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Funds</span>
          </button>

          <button
            onClick={() => router.push("/wallet/bank-accounts")}
            className="flex-1 h-12 bg-white border border-[#EAEAEA] text-[#121212] text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ArrowUpRight className="w-4 h-4 text-[#FF4D1A]" />
            <span>Withdraw</span>
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

      {/* Ledger Transactions History */}
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
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-[#121212]">{tx.category}</p>
                <p className="text-[10px] text-[#8A8A8A] font-mono">{tx.reference}</p>
              </div>
              <p
                className={`text-xs font-extrabold ${
                  tx.type === "INFLOW" ? "text-emerald-600" : "text-amber-700"
                }`}
              >
                {tx.type === "INFLOW" ? "+" : "-"}₦{tx.amount.toLocaleString("en-NG")}
              </p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
