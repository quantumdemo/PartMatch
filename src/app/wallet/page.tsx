"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, ArrowUpRight, History, ArrowLeft, Lock } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";

interface Transaction {
  id: string;
  reference?: string;
  category?: string;
  amount: number;
  type: string;
  created_at?: string;
}

export default function CustomerWalletPage() {
  const router = useRouter();
  const supabase = createClient();

  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [escrowBalance, setEscrowBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWalletData() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        // Query wallets
        const { data: wallet } = await supabase
          .from("wallets")
          .select("available_balance")
          .eq("user_id", userId)
          .maybeSingle();

        setAvailableBalance(Number(wallet?.available_balance || 0));

        // Query escrow balance
        const { data: escrows } = await supabase
          .from("escrow_transactions")
          .select("amount")
          .eq("buyer_id", userId)
          .eq("status", "SECURED");

        const totalEscrow = (escrows || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        setEscrowBalance(totalEscrow);

        // Query transactions
        let query = supabase
          .from("transactions")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (filter === "CREDIT") query = query.eq("type", "INFLOW");
        if (filter === "DEBIT") query = query.eq("type", "OUTFLOW");
        if (filter === "ESCROW") query = query.ilike("category", "%ESCROW%");

        const { data: txData } = await query;
        setTransactions(txData || []);
      } else {
        setAvailableBalance(0);
        setEscrowBalance(0);
        setTransactions([]);
      }

      setLoading(false);
    }

    loadWalletData();
  }, [filter]);

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.push("/")}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">Customer Wallet</h1>
          <p className="text-[11px] text-[#8A8A8A]">OPay-Style Instant Funding & Escrow</p>
        </div>
      </header>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-36 bg-neutral-200/80 rounded-[16px] animate-pulse" />
          <div className="h-24 bg-neutral-200/80 rounded-[16px] animate-pulse" />
        </div>
      ) : (
        <>
          {/* 48px Withdrawable Balance Card */}
          <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-[#8A8A8A] tracking-wider">
              Withdrawable Balance
            </span>

            <div className="flex items-baseline justify-between">
              <p className="text-[48px] font-extrabold text-[#121212] leading-none tracking-tight">
                ₦{availableBalance.toLocaleString("en-NG")}
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
                className="flex-1 h-12 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.97] transition-transform"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Fund Wallet</span>
              </button>

              <button
                onClick={() => router.push("/wallet/bank-accounts")}
                className="flex-1 h-12 bg-white border border-[#EAEAEA] text-[#121212] text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.97] transition-transform"
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
                Transaction History
              </h2>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#8A8A8A] space-y-1">
                <p>No transaction history found.</p>
                <p className="text-[10px]">Fund wallet or place escrow order to see transactions.</p>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-[#121212]">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-[#121212]">{tx.category || "Wallet Transaction"}</p>
                      <p className="text-[10px] text-[#8A8A8A] font-mono">{tx.reference || tx.id.slice(0, 8)}</p>
                    </div>
                    <p
                      className={`text-xs font-extrabold ${
                        tx.type === "INFLOW" ? "text-emerald-600" : "text-amber-700"
                      }`}
                    >
                      {tx.type === "INFLOW" ? "+" : "-"}₦{Number(tx.amount || 0).toLocaleString("en-NG")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <BottomNav />
    </main>
  );
}
