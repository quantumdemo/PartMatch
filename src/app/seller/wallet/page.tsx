"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, History, Lock } from "lucide-react";
import { WalletService, WalletBalanceInfo, WalletTransaction } from "@/lib/services/walletService";
import { BottomNav } from "@/components/BottomNav";

export default function SellerWalletPage() {
  const router = useRouter();
  const sellerId = "seller-001";

  const [balances, setBalances] = useState<WalletBalanceInfo | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      WalletService.getWalletBalance(sellerId),
      WalletService.getTransactions(sellerId),
    ]).then(([bal, txs]) => {
      setBalances(bal);
      setTransactions(txs);
      setLoading(false);
    });
  }, [sellerId]);

  if (loading || !balances) {
    return (
      <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen py-10 font-sans text-center">
        <p className="text-xs text-[#8A8A8A]">Loading Merchant Wallet...</p>
      </main>
    );
  }

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">Merchant Sales Wallet</h1>
          <p className="text-[11px] text-[#8A8A8A]">OPay-Style Direct Bank Payouts</p>
        </div>
      </header>

      {/* 48px Balance Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
        <span className="text-[10px] uppercase font-bold text-[#8A8A8A] tracking-wider">
          Withdrawable Sales Payout
        </span>

        <div className="flex items-baseline justify-between">
          <p className="text-[48px] font-extrabold text-[#121212] leading-none tracking-tight">
            ₦{balances.available_balance.toLocaleString("en-NG")}
          </p>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-[12px] flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-1.5 font-bold">
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>Pending Escrow Release:</span>
          </div>
          <span className="font-extrabold">₦{balances.escrow_balance.toLocaleString("en-NG")} NGN</span>
        </div>

        <button
          onClick={() => router.push("/wallet/bank-accounts")}
          className="w-full h-12 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Withdraw to Bank Account</span>
        </button>
      </div>

      {/* Merchant Transactions Ledger */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2">
          <h2 className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-[#FF4D1A]" />
            Sales Ledger History
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
                <p className="font-bold text-[#121212]">Escrow Release {tx.reference}</p>
                <p className="text-[10px] text-[#8A8A8A]">{tx.category}</p>
              </div>
              <p className="text-xs font-extrabold text-emerald-600">
                +₦{tx.amount.toLocaleString("en-NG")}
              </p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
