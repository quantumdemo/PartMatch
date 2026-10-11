# PartMatch System Architecture Specification

## 1. Stack Overview

PartMatch uses a unified backend architecture built entirely on **Supabase** (PostgreSQL, Auth, Storage, Realtime, Row Level Security) to power both the web frontend (Next.js 14 App Router) and future mobile applications (React Native / Expo).

```
                      +---------------------------------------+
                      |     PartMatch Client Applications     |
                      +-----------------+---------------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
   +-------------v-------------+                 +-------------v-------------+
   |   Next.js 14 Web App      |                 |   React Native / Expo     |
   |   (Admin R-05 & Web UI)   |                 |   Mobile Apps (R-01..04)  |
   +-------------+-------------+                 +-------------+-------------+
                 |                                             |
                 +----------------------+----------------------+
                                        |
                                +-------v-------+
                                |  Supabase SDK |
                                +-------+-------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
   +-------------v-------------+                 +-------------v-------------+
   |    Supabase Postgres DB    |                 |   Postgres RPC Functions  |
   |    (13 RLS Protected)     |                 |  (debit/credit atomic)    |
   +---------------------------+                 +---------------------------+
```

---

## 2. Shared Code Structure for Expo Mobile Reuse

All business logic, Zod schema validation rules, API wrappers, and custom hooks are stored inside decoupled modules in `src/`:

- `src/lib/validation.ts`: Zod schema definitions for all domain entities.
- `src/lib/security.ts`: Bcrypt PIN hashing, timing-safe Paystack webhook verification, and XSS sanitization.
- `src/lib/timezone.ts`: Nigerian WAT timezone formatting and expiry logic.
- `src/services/walletService.ts`: Parameterized calls to Supabase RPC stored procedures.
- `src/hooks/useWallet.ts`: Reusable React state hook for fetching balances and transaction histories.

---

## 3. Database Schema Overview (13 Tables)

1. `profiles`: Main user table holding role (`buyer`, `seller`, `mechanic`, `admin`), live verification status, and location coordinates.
2. `kyc_submissions`: User identity documents (NIN, CAC, store photos, trade certificates).
3. `wallets`: User balances in NGN (`available_balance` for withdrawable funds, `escrow_balance` for locked funds).
4. `transactions`: Immutable financial ledger logging all inflows, outflows, escrow holds, and payouts.
5. `escrow_holdings`: Active escrow holds tied to buyer/seller orders.
6. `payment_pins`: Bcrypt hashed payment PINs with lockout counters.
7. `bank_accounts`: Verified Nigerian bank accounts for Paystack payouts.
8. `profile_change_requests`: Queue for requesting changes to verified profile fields.
9. `platform_settings`: Platform dynamic configurations (fees %, maintenance flags).
10. `product_categories`: Parts and services taxonomy.
11. `products`: Spare parts inventory listed by sellers.
12. `orders`: Customer orders for parts and mechanic services.
13. `pin_change_logs`: Audit trail for payment PIN creations and resets.

---

## 4. Wallet & Escrow Ledger Design

All balance alterations must be executed using atomic PostgreSQL RPC stored procedures with `FOR UPDATE` row locks:

- `credit_wallet(p_user_id, p_amount, p_category, p_reference, p_description, ...)`
- `debit_wallet(p_user_id, p_amount, p_category, p_reference, p_description, p_lock_in_escrow, ...)`
- `create_transaction(...)`

Transactions are protected by database triggers that raise exceptions on any `UPDATE` or `DELETE` attempt.
