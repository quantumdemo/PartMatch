import { createClient } from "@/lib/supabase/client";

export class WalletService {
  /**
   * Executes atomic wallet credit via RPC
   */
  static async creditWallet(params: {
    userId: string;
    amount: number;
    category: string;
    reference: string;
    description: string;
    orderId?: string;
    escrowId?: string;
  }) {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("credit_wallet", {
      p_user_id: params.userId,
      p_amount: params.amount,
      p_category: params.category,
      p_reference: params.reference,
      p_description: params.description,
      p_order_id: params.orderId || null,
      p_escrow_id: params.escrowId || null,
    });

    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Executes atomic wallet debit via RPC
   */
  static async debitWallet(params: {
    userId: string;
    amount: number;
    category: string;
    reference: string;
    description: string;
    orderId?: string;
    escrowId?: string;
    lockInEscrow?: boolean;
  }) {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("debit_wallet", {
      p_user_id: params.userId,
      p_amount: params.amount,
      p_category: params.category,
      p_reference: params.reference,
      p_description: params.description,
      p_order_id: params.orderId || null,
      p_escrow_id: params.escrowId || null,
      p_lock_in_escrow: params.lockInEscrow || false,
    });

    if (error) throw new Error(error.message);
    return data;
  }
}
