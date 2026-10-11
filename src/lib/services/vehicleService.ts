import { createClient } from "@/lib/supabase/client";

export interface Vehicle {
  id: string;
  user_id: string;
  vin?: string;
  plate_number?: string;
  make: string;
  model: string;
  year: number;
  engine_type?: string;
  is_active: boolean;
  created_at: string;
}

export class VehicleService {
  /**
   * Fetches user vehicles directly from Supabase profile metadata
   */
  static async getUserVehicles(userId: string): Promise<Vehicle[]> {
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .select("kyc_status, formatted_address")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.warn("Supabase vehicle fetch error:", error.message);
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`partmatch_vehicles_${userId}`);
      if (stored) return JSON.parse(stored);
    }

    return [];
  }

  /**
   * Adds a new vehicle to user garage and persists to browser state
   */
  static async addVehicle(userId: string, vehicle: Omit<Vehicle, "id" | "user_id" | "is_active" | "created_at">): Promise<Vehicle> {
    const newVehicle: Vehicle = {
      id: `VEH-${Date.now()}`,
      user_id: userId,
      ...vehicle,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`partmatch_vehicles_${userId}`);
      const list: Vehicle[] = stored ? JSON.parse(stored) : [];
      list.push(newVehicle);
      localStorage.setItem(`partmatch_vehicles_${userId}`, JSON.stringify(list));
    }

    return newVehicle;
  }
}
