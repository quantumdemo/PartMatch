import { z } from "zod";
import { sanitizeInput } from "./security";

// User Roles & Enums
export const UserRoleSchema = z.enum(["buyer", "seller", "mechanic", "admin"]);
export const KycStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);
export const TransactionTypeSchema = z.enum(["INFLOW", "OUTFLOW"]);
export const TransactionCategorySchema = z.enum([
  "FUND_WALLET",
  "ESCROW_FUND",
  "ESCROW_RELEASE",
  "ESCROW_REFUND",
  "PAYOUT_SELLER",
  "PAYOUT_MECHANIC",
  "WITHDRAWAL",
  "PLATFORM_FEE",
  "REFUND",
]);
export const EscrowStatusSchema = z.enum([
  "PENDING_PAYMENT",
  "SECURED_IN_ESCROW",
  "SHIPPED",
  "DELIVERED",
  "DISPUTED",
  "RELEASED",
  "REFUNDED",
]);
export const OrderStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "DISPATCHED",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "DISPUTED",
]);

// Profile Schema
export const ProfileSchema = z.object({
  user_id: z.string().uuid(),
  role: UserRoleSchema,
  avatar_url: z.string().url().nullable().optional(),
  live_verified: z.boolean().default(false),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  formatted_address: z.string().transform(sanitizeInput).nullable().optional(),
  terms_accepted_at: z.string().or(z.date()).nullable().optional(),
  kyc_status: KycStatusSchema.default("PENDING"),
});

// KYC Submission Schema
export const KycSubmissionSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  role: UserRoleSchema,
  nin: z.string().min(11).max(11).optional(),
  cac: z.string().optional(),
  store_photo: z.string().url().optional(),
  proof_address: z.string().url().optional(),
  trade_cert: z.string().url().optional(),
  live_verification_image: z.string().url(),
  nin_photo: z.string().url().optional(),
  status: KycStatusSchema.default("PENDING"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// Wallet Schema
export const WalletSchema = z.object({
  user_id: z.string().uuid(),
  available_balance: z.number().min(0, "Balance cannot be negative"),
  escrow_balance: z.number().min(0, "Escrow balance cannot be negative"),
  total_earned: z.number().min(0),
  total_spent: z.number().min(0),
  currency: z.literal("NGN"),
});

// Transaction Schema
export const TransactionSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  type: TransactionTypeSchema,
  category: TransactionCategorySchema,
  amount: z.number().positive("Transaction amount must be greater than 0"),
  balance_before: z.number().min(0),
  balance_after: z.number().min(0),
  reference: z.string().regex(/^PM-REF-[A-Z0-9-]+$/, "Invalid reference format"),
  description: z.string().transform(sanitizeInput),
  order_id: z.string().uuid().nullable().optional(),
  escrow_id: z.string().uuid().nullable().optional(),
  status: z.enum(["SUCCESS", "PENDING", "FAILED"]),
});

// Payment PIN Schema
export const PaymentPinSchema = z.object({
  pin: z.string().regex(/^\d{4,6}$/, "Payment PIN must be 4 to 6 numeric digits"),
  confirm_pin: z.string().optional(),
}).refine((data) => !data.confirm_pin || data.pin === data.confirm_pin, {
  message: "PINs do not match",
  path: ["confirm_pin"],
});

// Bank Account Schema
export const BankAccountSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  bank_code: z.string().min(3).max(10),
  bank_name: z.string().transform(sanitizeInput),
  account_number: z.string().length(10, "Nigerian account number must be 10 digits"),
  account_name: z.string().transform(sanitizeInput),
  recipient_code: z.string().optional(),
  is_verified: z.boolean().default(false),
  is_default: z.boolean().default(false),
});

// Profile Change Request Schema
export const ProfileChangeRequestSchema = z.object({
  field_name: z.string().min(1).transform(sanitizeInput),
  old_value: z.string().nullable().optional(),
  new_value: z.string().min(1).transform(sanitizeInput),
  reason: z.string().min(5, "Reason must be at least 5 characters long").transform(sanitizeInput),
});
