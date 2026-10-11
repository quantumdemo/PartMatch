"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, History, Lock } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";

interface Transaction {
  id: string;
  reference?: string;
  category?: string;
  amount: number;
  type: string;
}

export default function SellerWalletPage() {
  const router = useRouter();
  const supabase = createClient();

  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [escrowBalance, setEscrowBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSellerWallet() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        const { data: wallet } = await supabase
          .from("wallets")
          .select("available_balance")
          .eq("user_id", userId)
          .maybeSingle();

        setAvailableBalance(Number(wallet?.available_balance || 0));

        const { data: escrows } = await supabase
          .from("escrow_transactions")
          .select("amount")
          .eq("seller_id", userId)
          .eq("status", "SECURED");

        const pending = (escrows || []).reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
        setEscrowBalance(pending);

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

    loadSellerWallet();
  }, [filter]);

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.push("/seller/dashboard")}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">Merchant Sales Wallet</h1>
          <p className="text-[11px] text-[#8A8A8A]">Direct Bank Payouts</p>
        </div>
      </header>

      {loading ? (
        <div className="space-y-3">
          <div className="h-36 bg-neutral-200/80 rounded-[16px] animate-pulse" />
          <div className="h-24 bg-neutral-200/80 rounded-[16px] animate-pulse" />
        </div>
      ) : (
        <>
          <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-[#8A8A8A] tracking-wider">
              Withdrawable Sales Payout
            </span>

            <div className="flex items-baseline justify-between">
              <p className="text-[48px] font-extrabold text-[#121212] leading-none tracking-tight">
                ₦{availableBalance.toLocaleString("en-NG")}
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-[12px] flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-1.5 font-bold">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>Pending Escrow Release:</span>
              </div>
              <span className="font-extrabold">₦{escrowBalance.toLocaleString("en-NG")} NGN</span>
            </div>

            <button
              onClick={() => router.push("/onboarding/bank")}
              className="w-full h-12 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Withdraw to Verified Bank Account</span>
            </button>
          </div>

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

          <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2">
              <h2 className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#FF4D1A]" />
                Sales Ledger History
              </h2>
            </div>

            {transactions.length === 0 ? (
              <p className="text-xs text-[#8A8A8A] text-center py-4">No seller payouts recorded yet.</p>
            ) : (
              <div className="space-y-2 text-xs text-[#121212]">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-[#121212]">{tx.category || "Sales Payout"}</p>
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

      <BottomNav />
    </main>
  );
}
