import { createClient } from "@/lib/supabase/client";

export interface UserProfileData {
  user_id: string;
  role: string;
  kyc_status: string;
  live_verified: boolean;
  formatted_address: string;
  created_at: string;
}

export class UserService {
  /**
   * Fetches user profile from Supabase `profiles`
   */
  static async getUserProfile(userId: string): Promise<UserProfileData | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      user_id: String(data.user_id),
      role: String(data.role),
      kyc_status: String(data.kyc_status),
      live_verified: Boolean(data.live_verified),
      formatted_address: String(data.formatted_address || "Lagos, Nigeria"),
      created_at: String(data.created_at),
    };
  }
}
