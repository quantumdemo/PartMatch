import { createClient } from "@/lib/supabase/client";

export interface WalletBalanceInfo {
  available_balance: number;
  escrow_balance: number;
  total_earned: number;
  total_spent: number;
}

export interface WalletTransaction {
  id: string;
  reference: string;
  category: string;
  amount: number;
  type: "INFLOW" | "OUTFLOW";
  created_at: string;
}

export class WalletService {
  /**
   * Fetches wallet balances from Supabase `wallets`
   */
  static async getWalletBalance(userId: string): Promise<WalletBalanceInfo> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) {
      return {
        available_balance: 0,
        escrow_balance: 0,
        total_earned: 0,
        total_spent: 0,
      };
    }

    return {
      available_balance: Number(data.available_balance || 0),
      escrow_balance: Number(data.escrow_balance || 0),
      total_earned: Number(data.total_earned || 0),
      total_spent: Number(data.total_spent || 0),
    };
  }

  /**
   * Fetches immutable transaction ledger logs from Supabase `transactions` with optional filter
   */
  static async getTransactions(userId: string, filterType = "ALL"): Promise<WalletTransaction[]> {
    const supabase = createClient();
    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (filterType === "CREDIT") query = query.eq("type", "INFLOW");
    if (filterType === "DEBIT") query = query.eq("type", "OUTFLOW");
    if (filterType === "ESCROW") query = query.ilike("category", "%ESCROW%");

    const { data, error } = await query;

    if (error || !data) {
      return [];
    }

    return data.map((item: Record<string, unknown>) => ({
      id: String(item.id),
      reference: String(item.reference || item.id),
      category: String(item.category || "Transaction"),
      amount: Number(item.amount || 0),
      type: (item.type as WalletTransaction["type"]) || "INFLOW",
      created_at: String(item.created_at || new Date().toISOString()),
    }));
  }
}
