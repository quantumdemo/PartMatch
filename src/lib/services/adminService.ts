import { createClient } from "@/lib/supabase/client";

export interface AdminMetrics {
  total_users: number;
  total_orders: number;
  total_escrow_held_ngn: number;
  platform_revenue_ngn: number;
}

export interface AdminUserRecord {
  user_id: string;
  role: string;
  formatted_address: string;
  kyc_status: string;
  created_at: string;
}

export class AdminService {
  /**
   * Fetches overall platform administrative metrics from Supabase
   */
  static async getPlatformMetrics(): Promise<AdminMetrics> {
    const supabase = createClient();
    const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
    const { count: orderCount } = await supabase.from("orders").select("*", { count: "exact", head: true });
    const { data: escrows } = await supabase.from("escrow_transactions").select("amount").eq("status", "SECURED");

    const totalHeld = (escrows || []).reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    const revenue = Math.round(totalHeld * 0.05);

    return {
      total_users: userCount || 0,
      total_orders: orderCount || 0,
      total_escrow_held_ngn: totalHeld,
      platform_revenue_ngn: revenue,
    };
  }

  /**
   * Fetches user accounts by role for administrative auditing
   */
  static async getUsers(roleFilter = ""): Promise<AdminUserRecord[]> {
    const supabase = createClient();
    let query = supabase.from("profiles").select("*");

    if (roleFilter && roleFilter !== "ALL") {
      query = query.eq("role", roleFilter);
    }

    const { data, error } = await query;

    if (error || !data) return [];

    return data.map((item: Record<string, unknown>) => ({
      user_id: String(item.user_id),
      role: String(item.role),
      formatted_address: String(item.formatted_address || "Lagos, Nigeria"),
      kyc_status: String(item.kyc_status || "PENDING"),
      created_at: String(item.created_at || new Date().toISOString()),
    }));
  }
}
