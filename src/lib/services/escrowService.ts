import { createClient } from "@/lib/supabase/client";

export interface EscrowSplit {
  totalAmount: number;
  sellerAmount: number; // 85%
  mechanicAmount: number; // 15%
  platformFee: number; // 5%
}

export class EscrowService {
  /**
   * Calculates mandatory escrow financial split (85% seller, 15% mechanic, 5% platform)
   */
  static calculateSplit(amount: number): EscrowSplit {
    const platformFee = Math.round(amount * 0.05);
    const remaining = amount - platformFee;
    const sellerAmount = Math.round(remaining * 0.85);
    const mechanicAmount = remaining - sellerAmount;

    return {
      totalAmount: amount,
      sellerAmount,
      mechanicAmount,
      platformFee,
    };
  }

  /**
   * Fetches user active escrow holdings from Supabase `escrow_holdings` table
   */
  static async getUserEscrowHoldings(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("escrow_holdings")
      .select("*")
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);

    if (error) {
      console.warn("Supabase escrow holdings fetch warning:", error.message);
      return [];
    }

    return data || [];
  }
}
