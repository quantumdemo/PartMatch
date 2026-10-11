"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wallet, ArrowUpRight, History, Wrench, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Transaction {
  id: string;
  reference?: string;
  category?: string;
  amount: number;
  type: string;
}

export default function MechanicWalletPage() {
  const router = useRouter();
  const supabase = createClient();

  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMechanicWallet() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        // Query wallet
        const { data: wallet } = await supabase
          .from("wallets")
          .select("available_balance")
          .eq("user_id", userId)
          .maybeSingle();

        setBalance(Number(wallet?.available_balance || 0));

        // Query transactions
        const { data: txData } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        setTransactions(txData || []);
      } else {
        setBalance(0);
        setTransactions([]);
      }

      setLoading(false);
    }

    loadMechanicWallet();
  }, [filter]);

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.push("/mechanic/dashboard")}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">Mechanic Payout Wallet</h1>
          <p className="text-[11px] text-[#8A8A8A]">OPay-Style Instant Bank Withdrawals</p>
        </div>
      </header>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-32 bg-neutral-200/80 rounded-[16px] animate-pulse" />
          <div className="h-24 bg-neutral-200/80 rounded-[16px] animate-pulse" />
        </div>
      ) : (
        <>
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

            <button
              onClick={() => router.push("/onboarding/bank")}
              className="w-full h-12 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Withdraw to Verified Bank Account</span>
            </button>
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

          {/* Ledger Transactions */}
          <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2">
              <h2 className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#FF4D1A]" />
                Recent Job Earnings
              </h2>
            </div>

            {transactions.length === 0 ? (
              <p className="text-xs text-[#8A8A8A] text-center py-4">No job earnings recorded yet.</p>
            ) : (
              <div className="space-y-2 text-xs text-[#121212]">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-[#121212]">{tx.category || "Mechanic Job Fee"}</p>
                      <p className="text-[10px] text-[#8A8A8A] font-mono">{tx.reference || tx.id.slice(0, 8)}</p>
                    </div>
                    <p className="text-xs font-extrabold text-emerald-600">
                      +₦{Number(tx.amount || 0).toLocaleString("en-NG")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Mechanic Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto bg-white border-t border-[#EAEAEA] h-16 flex items-center justify-around z-50">
        <button
          onClick={() => router.push("/mechanic/dashboard")}
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
          onClick={() => router.push("/me")}
          className="flex flex-col items-center gap-1 text-[#8A8A8A]"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">Me</span>
        </button>
      </nav>
    </main>
  );
}
