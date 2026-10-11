import { createClient } from "@/lib/supabase/client";

export type EscrowStatus =
  | "PENDING_PAYMENT"
  | "SECURED_IN_ESCROW"
  | "SHIPPED"
  | "DELIVERED"
  | "RELEASED"
  | "DISPUTED";

export interface EscrowHold {
  id: string;
  order_id: string;
  buyer_id: string;
  seller_id: string;
  amount_ngn: number;
  fee_ngn: number;
  seller_payout_ngn: number;
  mechanic_payout_ngn: number;
  platform_fee_ngn: number;
  status: EscrowStatus;
  release_at_wat: string;
}

export class EscrowService {
  /**
   * Calculates 85% Seller / 15% Mechanic / 5% Platform Escrow Fee split
   */
  static calculateSplit(totalAmountNGN: number): {
    total: number;
    sellerAmount: number;
    mechanicAmount: number;
    platformFee: number;
  } {
    const platformFee = Math.round(totalAmountNGN * 0.05);
    const remaining = totalAmountNGN - platformFee;
    const sellerAmount = Math.round(remaining * 0.85);
    const mechanicAmount = remaining - sellerAmount;

    return {
      total: totalAmountNGN,
      sellerAmount,
      mechanicAmount,
      platformFee,
    };
  }

  /**
   * Creates new Escrow Hold record
   */
  static async createEscrowHold(params: {
    orderId: string;
    buyerId: string;
    sellerId: string;
    amountNGN: number;
  }): Promise<EscrowHold> {
    const split = this.calculateSplit(params.amountNGN);
    const releaseDate = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 Hours WAT

    const escrowObj: EscrowHold = {
      id: `ESC-${Date.now()}`,
      order_id: params.orderId,
      buyer_id: params.buyerId,
      seller_id: params.sellerId,
      amount_ngn: params.amountNGN,
      fee_ngn: split.platformFee,
      seller_payout_ngn: split.sellerAmount,
      mechanic_payout_ngn: split.mechanicAmount,
      platform_fee_ngn: split.platformFee,
      status: "SECURED_IN_ESCROW",
      release_at_wat: releaseDate.toISOString(),
    };

    const supabase = createClient();
    await supabase.from("escrow_holdings").insert({
      id: escrowObj.id,
      order_id: params.orderId,
      buyer_id: params.buyerId,
      seller_id: params.sellerId,
      amount: params.amountNGN,
      fee: split.platformFee,
      status: "SECURED_IN_ESCROW",
      release_at: escrowObj.release_at_wat,
    });

    return escrowObj;
  }
}
