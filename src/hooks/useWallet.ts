import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatWAT } from "@/lib/timezone";

export interface WalletData {
  user_id: string;
  available_balance: number;
  escrow_balance: number;
  total_earned: number;
  total_spent: number;
  currency: string;
}

export interface TransactionData {
  id: string;
  type: "INFLOW" | "OUTFLOW";
  category: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  reference: string;
  description: string;
  created_at: string;
  formatted_date: string;
}

export function useWallet(userId?: string) {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchWalletData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch Wallet Balance
        const { data: walletData, error: walletErr } = await supabase
          .from("wallets")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (walletErr && walletErr.code !== "PGRST116") {
          throw walletErr;
        }

        if (walletData) {
          setWallet({
            ...walletData,
            available_balance: Number(walletData.available_balance || 0),
            escrow_balance: Number(walletData.escrow_balance || 0),
            total_earned: Number(walletData.total_earned || 0),
            total_spent: Number(walletData.total_spent || 0),
          });
        }

        // Fetch Transactions History
        const { data: txData, error: txErr } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (txErr) throw txErr;

        if (txData) {
          const formattedTxs: TransactionData[] = txData.map((tx) => ({
            id: tx.id,
            type: tx.type,
            category: tx.category,
            amount: Number(tx.amount),
            balance_before: Number(tx.balance_before),
            balance_after: Number(tx.balance_after),
            reference: tx.reference,
            description: tx.description,
            created_at: tx.created_at,
            formatted_date: formatWAT(tx.created_at),
          }));
          setTransactions(formattedTxs);
        }
      } catch (err: unknown) {
        console.error("Error fetching wallet data:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load wallet data.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchWalletData();
  }, [userId, supabase]);

  return { wallet, transactions, loading, error };
}
