export interface TooltipItem {
  id: string;
  title: string;
  explanation: string;
  example: string;
}

export const TOOLTIP_DICTIONARY: Record<string, TooltipItem> = {
  nin: {
    id: "nin",
    title: "National Identification Number (NIN)",
    explanation: "Your 11-digit official Nigerian identity number issued by NIMC. This confirms you are a real person.",
    example: "Example: 12345678901",
  },
  cac: {
    id: "cac",
    title: "CAC Registration Number",
    explanation: "Your Corporate Affairs Commission business registration number for registered spare parts shops or companies.",
    example: "Example: RC-1234567 or BN-9876543",
  },
  store_photo: {
    id: "store_photo",
    title: "Store Front Photo",
    explanation: "A clear photo showing your physical spare parts shop, store signpost, or warehouse building.",
    example: "Example: Photo showing your store signboard e.g. 'Ladipo Auto Spares Shop 12'",
  },
  proof_address: {
    id: "proof_address",
    title: "Proof of Address Document",
    explanation: "A recent utility bill (NEPA/EKEDC bill, LAWMA receipt, or tenancy agreement) showing your current shop or home location.",
    example: "Example: Electricity bill with your business or home address",
  },
  trade_cert: {
    id: "trade_cert",
    title: "Trade / Mechanic Certification",
    explanation: "Certificate or membership card showing you are a trained motor mechanic or certified auto technician.",
    example: "Example: NABTEB auto repair certificate or NAGAFF/MOMAN ID card",
  },
  service_radius: {
    id: "service_radius",
    title: "Service Radius (KM)",
    explanation: "How far (in kilometers) you are willing to travel from your workshop to fix customer cars.",
    example: "Example: 15 km (covers Ikeja, Maryland, and Oshodi)",
  },
  payment_pin: {
    id: "payment_pin",
    title: "4-Digit Security PIN",
    explanation: "A secret 4-digit code you will enter whenever you want to approve payments or withdraw money from your PartMatch wallet.",
    example: "Example: 4829 (Never share this with anyone)",
  },
  bank_account: {
    id: "bank_account",
    title: "Verified Nigerian Bank Account",
    explanation: "Your 10-digit NUBAN bank account matching your verified legal name where your wallet withdrawals will be sent.",
    example: "Example: GTBank - 0123456789 - Chinedu Auto Services",
  },
  live_verification: {
    id: "live_verification",
    title: "Live Face Verification",
    explanation: "A quick live photo taken using your camera where you blink to prove you are a real live human being.",
    example: "Example: Look into camera and blink twice when prompted",
  },
};
