export interface SellerOffer {
  seller_id: string;
  seller_name: string;
  location: string;
  rating: number;
  reviews_count: number;
  price_ngn: number;
  condition: "GENUINE_OEM" | "AFTERMARKET_HIGH_GRADE";
  delivery_days: string;
  contact_phone_masked: string;
  contact_phone_unmasked?: string;
  in_stock: boolean;
}

export interface PartProduct {
  id: string;
  title: string;
  brand: string;
  part_number: string;
  price: number;
  condition: string;
  description: string;
  seller_id: string;
  seller: {
    id: string;
    store_name: string;
    location: string;
    rating: number;
    total_sales: number;
    verified_at: string;
  };
  compatibility: {
    makes: string[];
    models: string[];
    year_start: number;
    year_end: number;
  };
  stock_quantity: number;
  images: string[];
}

const MOCK_PARTS: PartProduct[] = [
  {
    id: "part-001",
    title: "Toyota Corolla Ceramic Front Brake Pads",
    brand: "Toyota OEM",
    part_number: "OEM-04465-02220",
    price: 18500,
    condition: "NEW GENUINE OEM",
    description: "Genuine OEM Toyota ceramic front brake pad set. Formulated for heat dissipation and low dust under high Lagos traffic conditions.",
    seller_id: "seller-001",
    seller: {
      id: "seller-001",
      store_name: "Ladipo Auto Spares Merchant 12",
      location: "Mushin, Lagos",
      rating: 4.9,
      total_sales: 142,
      verified_at: "2026-01-15T10:00:00Z",
    },
    compatibility: {
      makes: ["Toyota"],
      models: ["Corolla", "Matrix"],
      year_start: 2009,
      year_end: 2019,
    },
    stock_quantity: 15,
    images: [],
  },
  {
    id: "part-002",
    title: "Honda Accord V6 Alternator 130A",
    brand: "Denso OEM",
    part_number: "DENSO-31100-RKB-004",
    price: 45000,
    condition: "NEW GENUINE OEM",
    description: "Original Denso heavy-duty alternator for Honda Accord 3.5L V6 engine.",
    seller_id: "seller-002",
    seller: {
      id: "seller-002",
      store_name: "Aspamda Trade Auto Hub",
      location: "Trade Fair, Lagos",
      rating: 4.7,
      total_sales: 89,
      verified_at: "2026-02-10T14:20:00Z",
    },
    compatibility: {
      makes: ["Honda"],
      models: ["Accord", "Pilot"],
      year_start: 2008,
      year_end: 2015,
    },
    stock_quantity: 4,
    images: [],
  },
];

export class MarketplaceService {
  /**
   * Searches auto parts catalog by query
   */
  static async searchParts(query: string): Promise<PartProduct[]> {
    if (!query) return MOCK_PARTS;
    const lower = query.toLowerCase();
    return MOCK_PARTS.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        p.brand.toLowerCase().includes(lower) ||
        p.part_number.toLowerCase().includes(lower)
    );
  }

  /**
   * Fetches part by ID
   */
  static async getPartById(partId: string): Promise<PartProduct | null> {
    return MOCK_PARTS.find((p) => p.id === partId) || MOCK_PARTS[0];
  }

  /**
   * Fetches comparative seller offers for a part
   */
  static async getPartSellers(partId: string): Promise<SellerOffer[]> {
    console.log("Fetching offers for partId:", partId);
    return [
      {
        seller_id: "seller-001",
        seller_name: "Ladipo Auto Spares Merchant 12",
        location: "Mushin, Lagos",
        rating: 4.9,
        reviews_count: 142,
        price_ngn: 18500,
        condition: "GENUINE_OEM",
        delivery_days: "Same Day Lagos Delivery",
        contact_phone_masked: "0803 *** 4829",
        contact_phone_unmasked: "08031234829",
        in_stock: true,
      },
      {
        seller_id: "seller-002",
        seller_name: "Aspamda Trade Auto Hub",
        location: "Trade Fair, Lagos",
        rating: 4.7,
        reviews_count: 89,
        price_ngn: 16000,
        condition: "AFTERMARKET_HIGH_GRADE",
        delivery_days: "24-48 Hours",
        contact_phone_masked: "0812 *** 9920",
        contact_phone_unmasked: "08129879920",
        in_stock: true,
      },
    ];
  }

  /**
   * Fetches seller public store profile
   */
  static async getSellerProfile(sellerId: string) {
    const defaultSeller = MOCK_PARTS[0].seller;
    if (sellerId === "seller-002") {
      return {
        ...MOCK_PARTS[1].seller,
        fitment_guarantee_rate: "99.2%",
      };
    }
    return {
      ...defaultSeller,
      fitment_guarantee_rate: "99.8%",
    };
  }
}

export type SellerProfileInfo = Awaited<ReturnType<typeof MarketplaceService.getSellerProfile>>;
