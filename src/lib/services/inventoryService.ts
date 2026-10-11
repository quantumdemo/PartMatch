import { createClient } from "@/lib/supabase/client";

export interface InventoryItem {
  id: string;
  seller_id: string;
  title: string;
  brand: string;
  part_number: string;
  price: number;
  condition: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
}

export class InventoryService {
  /**
   * Fetches seller inventory items from Supabase `products`
   */
  static async getSellerInventory(sellerId: string, search = ""): Promise<InventoryItem[]> {
    const supabase = createClient();
    let query = supabase.from("products").select("*").eq("seller_id", sellerId);

    if (search) {
      query = query.or(`title.ilike.%${search}%,part_number.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error || !data) {
      console.warn("Supabase inventory query warning:", error?.message);
      return [];
    }

    return data.map((item: Record<string, unknown>) => ({
      id: String(item.id),
      seller_id: String(item.seller_id),
      title: String(item.title),
      brand: String(item.brand || "OEM"),
      part_number: String(item.part_number || "GENUINE"),
      price: Number(item.price || 0),
      condition: String(item.condition || "NEW GENUINE OEM"),
      stock_quantity: Number(item.stock_quantity || 1),
      is_active: true,
      created_at: String(item.created_at || new Date().toISOString()),
    }));
  }

  /**
   * Adds a new spare part listing to Supabase
   */
  static async addPart(sellerId: string, part: Omit<InventoryItem, "id" | "seller_id" | "created_at">): Promise<InventoryItem | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          seller_id: sellerId,
          title: part.title,
          brand: part.brand,
          part_number: part.part_number,
          price: part.price,
          condition: part.condition,
          stock_quantity: part.stock_quantity,
        },
      ])
      .select()
      .maybeSingle();

    if (error || !data) {
      console.warn("Supabase add part error:", error?.message);
      return null;
    }

    return {
      id: String(data.id),
      seller_id: String(data.seller_id),
      title: String(data.title),
      brand: String(data.brand),
      part_number: String(data.part_number),
      price: Number(data.price),
      condition: String(data.condition),
      stock_quantity: Number(data.stock_quantity),
      is_active: true,
      created_at: String(data.created_at),
    };
  }
}
