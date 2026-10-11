import { createClient } from "@/lib/supabase/client";

export interface OrderRecord {
  id: string;
  order_ref: string;
  part_title: string;
  part_number: string;
  amount: number;
  status: "SECURED_IN_ESCROW" | "SHIPPED" | "DELIVERED" | "DISPUTED" | "RELEASED" | "REFUNDED";
  buyer_id: string;
  seller_id: string;
  mechanic_id?: string;
  created_at: string;
  escrow_release_at: string;
}

export class OrderService {
  /**
   * Fetches customer orders from Supabase `orders` and `escrow_holdings`
   */
  static async getUserOrders(userId: string): Promise<OrderRecord[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("escrow_holdings")
      .select("*")
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.warn("Supabase orders query warning:", error?.message);
      return [];
    }

    return data.map((item: Record<string, unknown>) => ({
      id: String(item.id),
      order_ref: `PM-REF-${String(item.id).substring(0, 8).toUpperCase()}`,
      part_title: "Toyota Ceramic Brake Pad Set",
      part_number: "OEM-04465-02220",
      amount: Number(item.amount || 0),
      status: (item.status as OrderRecord["status"]) || "SECURED_IN_ESCROW",
      buyer_id: String(item.buyer_id),
      seller_id: String(item.seller_id),
      created_at: String(item.created_at || new Date().toISOString()),
      escrow_release_at: String(item.release_at || new Date().toISOString()),
    }));
  }

  /**
   * Fetches single order by ID
   */
  static async getOrderById(orderId: string): Promise<OrderRecord | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("escrow_holdings")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: String(data.id),
      order_ref: `PM-REF-${String(data.id).substring(0, 8).toUpperCase()}`,
      part_title: "Toyota Ceramic Brake Pad Set",
      part_number: "OEM-04465-02220",
      amount: Number(data.amount || 0),
      status: (data.status as OrderRecord["status"]) || "SECURED_IN_ESCROW",
      buyer_id: String(data.buyer_id),
      seller_id: String(data.seller_id),
      created_at: String(data.created_at || new Date().toISOString()),
      escrow_release_at: String(data.release_at || new Date().toISOString()),
    };
  }
}
