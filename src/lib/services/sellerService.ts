import { createClient } from "@/lib/supabase/client";

export interface SellerProfileMetrics {
  seller_id: string;
  store_name: string;
  cac_number: string;
  kyc_status: string;
  formatted_address: string;
  total_earnings_ngn: number;
  pending_escrow_ngn: number;
  today_orders_count: number;
  inventory_count: number;
  low_stock_alerts_count: number;
}

export class SellerService {
  /**
   * Fetches seller profile metrics and order summary from Supabase
   */
  static async getSellerMetrics(sellerId: string): Promise<SellerProfileMetrics> {
    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", sellerId)
      .maybeSingle();

    const { data: inventory } = await supabase
      .from("inventory")
      .select("id, stock_quantity")
      .eq("seller_id", sellerId);

    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .eq("seller_id", sellerId);

    const inventoryCount = inventory?.length || 0;
    const lowStockCount = inventory?.filter((p) => (p.stock_quantity || 0) < 3).length || 0;
    const totalEarnings = (orders || []).reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0);

    return {
      seller_id: sellerId,
      store_name: profile?.store_name || profile?.company_name || profile?.full_name || "Merchant Store",
      cac_number: profile?.cac_number || "RC-PENDING",
      kyc_status: profile?.kyc_status || "PENDING",
      formatted_address: profile?.formatted_address || "Lagos, Nigeria",
      total_earnings_ngn: totalEarnings,
      pending_escrow_ngn: 0,
      today_orders_count: orders?.length || 0,
      inventory_count: inventoryCount,
      low_stock_alerts_count: lowStockCount,
    };
  }
}
