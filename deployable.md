# PartMatch Real Flow Order & Zero Mock Data Implementation

## Overview
PartMatch is a vehicle spare parts marketplace with AI diagnosis, 72-hour Escrow, and Mobile Mechanic assignment designed specifically for Nigeria (₦ NGN).

This release enforces the strict onboarding flow order, eliminates all mock/dummy fallback data across the application, and implements desktop-only admin separation with secret path authorization.

---

## Complete Application User Flow (Group A to F)

### STEP 0: Middleware Flow Controller (`src/middleware.ts`)
- **Unauthenticated Users**: Redirected to `/onboarding`.
- **Missing Role**: Redirected to `/onboarding` (Role Select).
- **Unverified KYC**: Redirected to `/onboarding/kyc`.
- **Missing Transaction PIN**: Redirected to `/onboarding/pin`.
- **Unverified Bank Account** (for R-02 Fleet, R-03 Seller, R-04 Mechanic): Redirected to `/onboarding/bank`.
- **Verified Users**: Granted access to home dashboard (`/`).

---

### GROUP A: Onboarding Group (`/onboarding/*`)
1. `/onboarding`: Role Select (R-01 Driver, R-02 Fleet, R-03 Seller, R-04 Mechanic). Stores `role_pending` in localStorage.
2. `/onboarding/auth`: Authentication via Supabase OAuth (Google/Apple) or Email + Password (6-digit OTP verification with 60s resend timer).
3. `/onboarding/profile`: Complete profile form (Full Name, Phone + OTP verify, Address, Role-specific fields like CAC Number or Service Radius).
4. `/onboarding/picture`: Mandatory clear face profile picture upload to `avatars` bucket.
5. `/onboarding/kyc`: KYC Document Upload (NIN number + NIN doc, Driver License front/back, Selfie with ID, CAC doc / Trade cert) saved to `kyc-documents` bucket & `kyc_submissions` table.
6. `/onboarding/pin`: 4-Digit Payment/Transaction PIN bcrypt hashed into `profiles.pin_hash`.
7. `/onboarding/bank`: NUBAN account verification using Paystack `/api/banks/resolve` API saved to `bank_accounts` table.
8. `/onboarding/success`: Confirmation banner ("KYC Pending Verification - You can browse but cannot transact until verified") + Go to Home CTA.

---

### GROUP B: Home & Garage (`/` & `/garage/*`)
9. `/` (Home Dashboard): Displays real profile data (`Hi, {first_name}`), real wallet balance (default `₦0`), real recent orders (`buyer_id = user.id`), announcements banner, big `#FF4D1A` AI scanner CTA, and Book Mechanic card.
10. `/garage`: Vehicle list query for `owner_id = user.id` with Skeleton loading and Empty state ("No vehicle yet").
11. `/garage/add`: Add vehicle form (VIN, License Plate, Year, Make, Model, Engine Type) saving to `vehicles` table.
12. `/garage/[id]`: Vehicle details view with option to trigger AI diagnosis.

---

### GROUP C: AI Identify & Fitment (`/diagnose/*` & `/api/diagnose`)
13. `/diagnose`: 4 diagnosis method options (Camera, Upload Photo, Record Audio, Text Description) with mandatory target vehicle selection from garage.
14. `/diagnose/scanning`: AI scanning skeleton + camera view + WAT timestamp.
15. `/api/diagnose`: Backend API endpoint calling `gpt-4o-mini` vision model if `OPENAI_API_KEY` is present or smart keyword fallback with real confidence score, saving result to `ai_diagnoses` table.
16. `/diagnose/result`: Displaying 48px part title hierarchy, real confidence badge, OEM guess, urgency, symptoms, and checking Supabase `inventory` for approved compatible parts.
17. `/diagnose/fitment`: Fitment check verification displaying 100% fitment guarantee for target garage vehicle.

---

### GROUP D: Marketplace & Escrow Checkout (`/marketplace/*`, `/cart`, `/checkout/*`)
18. `/marketplace`: List approved inventory matching diagnosed parts with 48px price hierarchy, seller name, Genuine/Aftermarket badge, rating, Skeleton loading, and Empty state.
19. `/marketplace/[partId]`: Inventory item detail with seller store profile and Add to Cart / Buy Escrow options.
20. `/cart`: Shopping cart querying `cart_items` table with subtotal calculation.
21. `/checkout`: Escrow checkout breakdown (85% Seller, 10% Mechanic, 5% Platform fee split) with delivery address input.
22. `/checkout/pay`: Payment method selection (Paystack Card / Transfer) + PIN authorization modal creating `orders` (`SECURED_IN_ESCROW`) & `escrow_transactions`.

---

### GROUP E & F: Delivery, Mechanics, Wallet, Support & Admin
23. `/orders`: Orders list with All / Active / Completed status tabs.
24. `/delivery/confirm/[id]`: Customer confirmation with working part video evidence upload to `job-evidence` bucket and big orange `#FF4D1A` 48px CTA releasing escrow payouts.
25. `/mechanics`: Mobile mechanics near me query (`role = R-04` & `online_status = true`) with Mapbox tracking simulation.
26. `/mechanics/[id]`: Mechanic profile & job assignment creating `mechanic_jobs` status `PENDING`.
27. `/mechanics/job/[id]`: Mechanic en route live tracking with unmasked contact phone option upon acceptance.
28. `/wallet`: OPay style wallet displaying real available balance, escrow locked balance, and transaction history filters.
29. `/me`: User profile displaying locked verified fields with Lucide Lock icon and `/me/request-change` form saving to `profile_change_requests`.
30. `/support`: OPay support center with 8 categories grid, FAQ accordions from `faqs` table, and big `#FF4D1A` Live Chat CTA leading to `/support/chat/[id]`.
31. `/notifications`: Realtime notifications list for announcements, order updates, and ticket replies.

---

## Admin Separation (`/_admin_9x8k2p` & `/admin/*`)

1. **Secret Path Authorization**:
   - Access to `/admin` routes requires environment variables `ADMIN_SECRET_PATH` (`/_admin_9x8k2p`) and `SUPER_ADMIN_EMAILS`.
2. **Desktop Browser Restriction**:
   - Requests from mobile User Agents (<768px) render a dedicated message: *"Admin Desktop Only - Open on PC"*.
3. **Admin Desktop Layout**:
   - Dedicated 240px fixed dark sidebar navigation (`src/app/admin/layout.tsx`).
4. **Admin Portal Features**:
   - Overview Analytics Dashboard with platform 5% fee revenue calculation.
   - User Accounts & KYC Queue Review.
   - Inventory Item Review (`PENDING_REVIEW` -> `APPROVED`).
   - Escrow Holdings Manual Release & Override Controls.
   - Support Chat Console & Dispute Resolution Logs.

---

## Environment Variables Configuration

Add the following environment variables to `.env.local` or Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

OPENAI_API_KEY=your-openai-api-key
PAYSTACK_SECRET_KEY=your-paystack-secret-key

ADMIN_SECRET_PATH=/_admin_9x8k2p
SUPER_ADMIN_EMAILS=admin@partmatch.ng,superadmin@partmatch.ng
NEXT_PUBLIC_ADMIN_PATH=/_admin_9x8k2p
```

---

## Build Verification

Run build verification to confirm zero ESLint errors and static generation:

```bash
npm run build
```
