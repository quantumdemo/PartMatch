# PartMatch Master Product Specification (v1.0)

## 1. Project Overview
**PartMatch** is an end-to-end, escrow-backed automotive e-commerce and mobile installation marketplace designed specifically for the African automotive ecosystem, with a primary focus on Nigeria.

### The Problem in Nigeria
The Nigerian automotive aftermarket faces three critical structural challenges:
1. **Counterfeit and Compatible Part Uncertainty:** Vehicle owners and fleet operators frequently purchase fake, substandard, or mismatched auto parts. This leads to costly mechanical breakdowns, safety hazards, and repeated repair expenses.
2. **Merchant and Customer Trust Deficit:** High rates of online fraud and non-delivery mean customers are hesitant to pay upfront, while parts sellers are unwilling to ship high-value components without guaranteed payment.
3. **Mechanic Fraud and Quality Variation:** Finding verified, reliable mobile mechanics who can correctly diagnose vehicle faults and install components with guaranteed workmanship is extremely difficult.

### The PartMatch Solution
PartMatch bridges these gaps through a multi-role, escrow-backed ecosystem:
* **Guaranteed Compatibility:** AI-driven OEM matching and VIN scanning verify part fitment before purchase.
* **Escrow-Secured Payments:** Buyer funds are held safely in escrow. Payments are only released to parts sellers and mobile mechanics after the customer confirms physical receipt, satisfactory installation, and vehicle testing.
* **Verified Service Providers:** Mandatory KYC verification (NIN, CAC, Trade Certificates) guarantees that only vetted merchants and certified mobile mechanics operate on the platform.

### The 5 Core Platform Roles
1. **R-01 Customer (Individual Car Driver):** Searches for parts via AI diagnostics or manual OEM search, orders escrow-backed parts, requests mobile mechanics, and approves payment release after successful testing.
2. **R-02 Vehicle Owner (Fleet Manager / Multi-Car Owner):** Manages multiple vehicles in a digital garage, tracks scheduled maintenance, monitors recurring part orders, and manages driver assignments.
3. **R-03 Parts Seller (Auto Parts Merchant Store):** Manages inventory listings, auto-fills OEM specs via AI image scanning, receives escrow-secured orders, dispatches parts with tracking numbers, and receives payouts upon customer approval.
4. **R-04 Mobile Mechanic (On-Demand Repair Driver):** Operates on-demand (similar to Bolt/Uber drivers), accepts nearby installation jobs, navigates to customer locations, completes mandatory installation checklists with photo/video proof, and earns escrow-backed installation fees.
5. **R-05 Admin Owner (Master Platform Operator):** Controls the web-based master dashboard, reviews KYC verification queues, overrides immutable profile fields, manages escrow disputes and manual releases, broadcasts targeted announcements, and monitors platform financial reports.

---

## 2. Design System

PartMatch strictly enforces a minimalist, high-contrast, accessibility-focused design system across all mobile applications (R-01, R-02, R-03, R-04) and the desktop web dashboard (R-05).

### Color Palette
* **Background:** `#FFFBF5` (Warm Cream / Off-White) – Provides a calm, anti-glare foundation.
* **Card Surface:** `#FFFFFF` (Pure White) – Clean, elevated content containers with subtle borders.
* **Primary Accent:** `#FF4D1A` (Electric Orange) – **Strictly reserved for primary Call-to-Action (CTA) buttons**, active state highlights, and urgent primary indicators.
* **Primary Text:** `#0F172A` (Slate 900) – High-contrast dark text for headings and key values.
* **Secondary Text:** `#64748B` (Slate 500) – Neutral text for subheaders, labels, and supporting details.
* **Border Lines:** `#E2E8F0` (Slate 200) – Clean, light structural dividing lines.
* **Muted Background:** `#F8FAFC` (Slate 50) – Subdued fill color for form fields and table rows.
* **Status Indicators:**
  * *Success:* `#15803D` (Green 700) / `#DCFCE7` (Green 100 Fill)
  * *Warning / Escrow Pending:* `#B45309` (Amber 700) / `#FEF3C7` (Amber 100 Fill)
  * *Error / Urgent:* `#B91C1C` (Red 700) / `#FEE2E2` (Red 100 Fill)

### Visual Rules & Constraints
* **Gradients:** Strictly prohibited across all screens to ensure clean visual focus and rapid rendering performance.
* **Emojis:** Strictly prohibited. All visual icons must exclusively use **Lucide Line Icons** (`data-lucide="..."`).
* **Border Radius:** Fixed at **16px** for all cards, containers, and elevated surfaces (`rounded-2xl`). Buttons use **12px** (`rounded-xl`).
* **Typography & Big Number Hierarchy:** Important metrics (such as Today's Sales, Job Price, Escrow Holdings, and Total Users) must be displayed using prominent typography (`text-3xl` or `text-4xl`, `font-extrabold` or `font-black`).
* **Micro-Animations:** Micro-interactions (hover, active button presses, loading states) are restricted to subtle **150ms to 300ms** transitions.
* **State Completeness Rule:** Every screen displaying dynamic list data must support three explicit layout states: **Skeleton Loading State**, **Empty State** (with relevant illustration/icon and guidance CTA), and **Error/Offline State**.
* **Header Architecture:**
  * *Mobile Header:* Includes active screen title, top-right Help (`help-circle`) and Notification (`bell`) icons with red unread indicators.
  * *Mobile Bottom Navigation:* Standard 4-to-5 tab persistent bar (Dashboard | Inventory | Orders | Wallet | Me for Sellers; Jobs | Map | Earnings | Me for Mechanics).
  * *Desktop Web Navigation:* Persistent vertical left sidebar navigation with collapsed/expanded states.

---

## 3. Authentication Flow (Detailed Architecture)

PartMatch implements a secure multi-tiered authentication architecture optimized for high delivery reliability and cost efficiency in West Africa.

### Sign Up Options
Users can sign up using **Google OAuth**, **Apple ID**, or **Email Address**.

### Email OTP Code vs. SMS OTP (Rationale)
* **Email OTP Verification:** Primary account authentication and email verification use a 6-digit numeric OTP sent via transactional email (Resend / SendGrid). Email OTP is selected as the primary authentication mechanism because SMS deliverability across Nigerian telecommunication networks suffers from frequent delays, Do-Not-Disturb (DND) blocking, and high per-SMS costs.
* **SMS Phone OTP:** Phone number verification via SMS OTP is used **exclusively as a secondary step** during mandatory profile creation to verify valid mobile phone numbers for order dispatch and mechanic contact. Phone numbers are **not** used as primary login credentials.

### Authentication Step-by-Step Flow
1. **Role Selection (Screen 01):** User selects target role (Customer Driver, Fleet Owner, Parts Seller Store, Mobile Mechanic).
2. **Identity Provider / Email Entry (Screen 02):** User chooses Google, Apple, or inputs an email address.
3. **Email OTP Verification (Screen 03):** User enters the 6-digit code delivered to their email inbox.
4. **Set Password (Screen 04):** Mandatory creation of a strong password (minimum 8 characters, number, and special symbol).
5. **Mandatory Role Profile Form (Screen 05):** User provides required legal credentials based on role:
   * *R-01/R-02:* Full Name, Residential Address, Primary Vehicle Brand.
   * *R-03 Seller:* Business Store Name, CAC Registration Number, Warehouse Address, Verified Phone.
   * *R-04 Mechanic:* Full Name, Service Radius (km), Years of Experience, Workshop / Work Photos.
6. **Session & Token Management:** Successful authentication issues an encrypted JWT access token (15-minute expiration) and a secure HTTP-only refresh token (30-day rotation cycle).

---

## 4. Onboarding to R-02 (Driver & Fleet Garage System)

The customer onboarding process guides users directly into establishing their digital vehicle garage to ensure accurate part compatibility matching.

### Onboarding Steps
1. **Welcome Onboarding Screens:** Demonstrates AI diagnosis, escrow protection, and mobile mechanic installation.
2. **VIN Scanning & License Plate Lookup:**
   * Users can scan their vehicle chassis/VIN barcode using their mobile camera or manually input the 17-digit VIN / Nigerian vehicle registration number.
   * PartMatch decodes the VIN (Year, Make, Model, Engine Type, Fuel Type, Transmission) via an integrated vehicle database API.
3. **Garage Management:**
   * Individual Drivers (R-01) store 1 to 3 personal vehicles.
   * Fleet Owners (R-02) store dozens or hundreds of commercial vehicles with sub-fleet categories (e.g., Delivery Vans, Corporate Sedans).
4. **Compatible Parts Intelligence Engine:**
   * Every part listed in the PartMatch marketplace is cross-referenced against the active vehicle selected in the user's garage.
   * If a part matches the selected vehicle's exact OEM specification, a green **"100% Fits Your Vehicle"** badge is displayed. If incompatible, a clear warning banner prevents checkout.

---

## 5. Role-by-Role UI Breakdown (All 86 Screens)

### Group 1: R-01 Driver & R-02 Fleet Owner (38 Screens)
* `01RoleSelect.png`: Screen for selecting application user role (Driver, Fleet, Seller, Mechanic).
* `02SignUpMethod.png`: Sign up entry with Google, Apple, and Email options.
* `03EmailCodeVerify.png`: 6-digit email OTP verification input screen.
* `04SetPassword.png`: Password creation form with strength meter.
* `05CompleteProfile.png`: Personal profile input form (Full Name, Address, Phone OTP).
* `06ProfilePhotoCheck.png`: Camera selfie capture for profile validation.
* `07KYCUpload.png`: Upload interface for National Identification Number (NIN) slip.
* `08HomeHappy.png`: Primary driver dashboard with active vehicle header, search bar, category shortcuts, and trending parts.
* `09HomeSkeleton.png`: Skeleton loading state for home dashboard.
* `10GarageList.png`: View saved vehicles in garage with active selection toggles.
* `11GarageEmpty.png`: Empty state screen when no vehicle has been added to garage.
* `12AddVehicleForm.png`: Manual vehicle details entry form (Make, Model, Year, Trim, Engine).
* `13AddVehicleSuccess.png`: Confirmation overlay after adding a vehicle to garage.
* `14DiagnoseMethod.png`: Select vehicle diagnostic method (AI Audio Scan, Visual Photo Scan, Manual Symptom Checklist).
* `15AIScanning.png`: Animated scanner processing diagnostic input (audio frequency or engine photo analysis).
* `16AIResult.png`: AI diagnostic result showing detected fault (e.g., Worn Brake Pads) and recommended OEM replacement parts.
* `17VerifyFitment.png`: Compatibility verification screen checking part specs against user's VIN.
* `18ManualSearchFallback.png`: Manual search and filter catalog when AI diagnosis is bypassed.
* `19CompareSellers.png`: Side-by-side comparison of multiple sellers offering the same OEM part (Price, Delivery Time, Seller Rating).
* `20SellerProfile.png`: Merchant store overview showing business rating, total sales, warehouse location, and inventory.
* `21Cart.png`: Shopping cart screen displaying part items, selected installation service add-on, and subtotal.
* `22CheckoutEscrow.png`: Checkout summary highlighting Escrow Payment protection terms.
* `23PaymentMethod.png`: Payment gateway selector (Debit Card, Bank Transfer, USSD via Paystack/Flutterwave).
* `24OrderPlaced.png`: Success confirmation screen showing Escrow Secured status and dispatch countdown.
* `25OrderTracking.png`: Live order delivery tracking screen with courier details and status timeline.
* `26FindMechanics.png`: List of nearby certified mobile mechanics available for installation.
* `27MechanicsEmpty.png`: Empty state screen when no mechanics are currently online in the search radius.
* `28MechanicProfile.png`: Detailed mechanic profile showing experience years, trade certification, hourly rate, and customer reviews.
* `29MechanicOnWay.png`: Live map showing accepted mechanic navigating to customer location.
* `30InstallChecklist.png`: Installation progress screen displaying checklist steps being executed by the mechanic.
* `31CustomerConfirm.png`: Customer confirmation form to inspect installed part, test drive vehicle, and input confirmation PIN.
* `32PaymentReleased.png`: Success screen showing escrow funds released to seller and mechanic upon customer confirmation.
* `33WalletOPayStyle.png`: Customer wallet balance, transaction logs, and refund history.
* `34OrdersHistory.png`: Comprehensive order history tab categorizing Active, Completed, and Disputed orders.
* `35MeOPayPattern.png`: Customer profile and account settings page following OPay layout patterns.
* `36ProfileLocked.png`: View locked profile fields with Request Admin Change button.
* `37Announcements.png`: Platform inbox containing admin announcements and policy updates.
* `38SupportChat.png`: Live customer support interface with AI Bot and Human Agent escalation.

---

### Group 2: R-03 Parts Seller Store (16 Screens)
* `01_SignUp.png`: Seller store registration form (Store Name, CAC Number, Warehouse Address, Phone OTP).
* `02_KYC_Mandatory.png`: Mandatory seller document upload screen (NIN, CAC Certificate, Store Photo, Utility Bill Proof of Address) with Pending Verification banner.
* `03_Dashboard_Happy.png`: Seller main dashboard with Today's Sales BIG number ($420), Escrow Secured ($210), Pending Shipments (3), and Admin Announcement Banner.
* `04_Dashboard_Empty_Skeleton.png`: Skeleton loading state and zero-sales empty state with "Add First Part" guidance button.
* `05_Inventory_List.png`: Catalog list showing Part Name, SKU, Stock Quantity, Price BIG ($85), Genuine OEM vs. Aftermarket tags, and Edit action.
* `06_Inventory_Empty.png`: Empty state screen for inventory with step-by-step guidance on listing parts.
* `07_Add_Part.png`: Form to list a new part featuring AI Photo auto-fill for OEM specs, Price, Condition, Stock, and Compatible Vehicles.
* `08_Edit_Part_Locked.png`: Edit part screen showing LOCKED OEM & Fitment fields post-verification with "Request Admin Change" button.
* `09_Orders_List.png`: Incoming orders list with mandatory badge **"Payment Secured in Escrow - Safe to Ship"** and dispatch action.
* `10_Order_Detail.png`: Detailed order overview displaying customer vehicle specs, part required, escrow status stepper (`PENDING_PAYMENT` -> `SECURED` -> `SHIPPED`), and Courier Tracking Number input.
* `11_Order_Tracking.png`: Seller-facing delivery tracking view following courier progress.
* `12_Wallet.png`: Seller wallet displaying Available Balance ($1,840.50), Locked Escrow Holdings ($630.00), OPay-style transaction history, and Bank Withdrawal button.
* `13_Me_Screen.png`: Store profile overview following OPay pattern, Security Center, Bank Account settings, and Immutable Profile lock container.
* `14_KYC_Status.png`: Approval confirmation screen displaying verified CAC, Store, and Identity documents.
* `15_Announcements_Inbox.png`: Broadcast messaging inbox tailored specifically for parts sellers.
* `16_Support_Chat.png`: Dedicated seller support chat with AI assistant and human agent escalation.

---

### Group 3: R-04 Mobile Mechanic Driver (14 Screens)
* `01_SignUp.png`: Mechanic registration form (Full Name, Phone OTP, Service Area Radius, Years of Experience, Work Photos).
* `02_KYC_Mandatory.png`: Mandatory mechanic document upload (NIN, Driver License, Trade Certificate, Selfie) with "Cannot accept jobs until verified" constraint.
* `03_Jobs_List_Happy.png`: Nearby job requests feed showing distance (1.2km), customer vehicle, part to install, Price BIG ($15), and Accept/Reject CTAs.
* `04_Jobs_Empty_Skeleton.png`: Skeleton loading state and zero-jobs empty state with "Go Online" toggle button.
* `05_Job_Detail.png`: Detailed job breakdown showing customer address, part specs, and masked phone number (unlocked upon acceptance).
* `06_Job_Accepted_Navigation.png`: GPS navigation screen with live map route to customer location, ETA, and "Confirm Arrived" CTA.
* `07_Arrived_Start_Installation.png`: Arrival confirmation screen with customer verification prompt and "Start Installation" button.
* `08_Installation_Checklist.png`: Step-by-step installation checklist (Old Part Uninstalled, New Part Torqued, Engine Tested) and required photo/video upload.
* `09_Waiting_Customer_Confirmation.png`: Waiting screen displaying Escrow Pending badge while customer tests vehicle and inputs confirmation code.
* `10_Earnings_Wallet.png`: Mechanic wallet displaying Today's Earnings BIG ($145.00), Escrow Pending ($15.00), Completed Jobs count, and Bank Withdrawal button.
* `11_Me_Screen.png`: Mechanic profile, security settings, bank details, and immutable profile lock box.
* `12_Announcements.png`: Targeted region announcements feed (e.g., peak-hour bonus alerts in Lagos Island).
* `13_Support_Chat.png`: Mobile support interface for mechanics.
* `14_Job_History_Ratings.png`: Detailed job history log displaying customer feedback ratings and star reviews (4.9 / 5.0).

---

### Group 4: R-05 Admin Web Dashboard (18 Screens)
* `01_Admin_Login.png`: Desktop login screen with Email, Password, and 2FA OTP input. Explicitly excludes social sign-in and public registration buttons.
* `02_Analytics_Dashboard.png`: Master KPI dashboard showing Total Users BIG (14,280), Total Escrow Held BIG ($12,450.00), Today's Orders (84), KYC Status %, and Volume Chart.
* `03_Users_List.png`: Comprehensive user management table with role filters (R-01/R-02/R-03/R-04), global search, verified badges, and skeleton row loading.
* `04_User_Detail_Override.png`: Master profile inspector allowing super admin to override immutable fields (NIN, Phone, CAC, Address) or ban accounts.
* `05_KYC_Verification_Queue.png`: Document verification queue showing uploaded NIN slips, CAC certificates, trade licenses, with side-by-side Approve / Reject with Reason CTAs.
* `06_Profile_Change_Requests.png`: Review queue for user-submitted requests to alter locked profile details (e.g., phone number updates).
* `07_Escrow_Holdings.png`: Master escrow ledger monitoring all platform transactions across `PENDING`, `SECURED_IN_ESCROW`, `RELEASED`, and `DISPUTED` states with manual release override.
* `08_Orders_Management.png`: Global order oversight table tracking courier waybills and force-confirm options for delivered orders.
* `09_Dispute_Center.png`: Mediation center displaying customer vs. seller chat logs, uploaded evidence photos, and CTAs for Full Refund or Seller Release.
* `10_Inventory_Oversight.png`: Global product catalog monitor allowing admins to inspect listed parts and flag suspect counterfeit items.
* `11_Mechanic_Jobs_Oversight.png`: Live map overview tracking active mobile mechanics currently executing installation jobs across Nigeria.
* `12_Announcements_Create.png`: Announcement broadcast creator targeting specific audiences (All Users, Role-Specific e.g. R-03, or Location-Specific e.g. Lagos).
* `13_Announcements_History.png`: Historical log of sent broadcasts and recipient delivery metrics.
* `14_Support_Chats.png`: Support ticket management center for handling AI chatbot escalations to human agents.
* `15_Security_Center.png`: System security console monitoring login audit trails, IP logs, failed 2FA attempts, and banned accounts.
* `16_Payouts.png`: Merchant and mechanic payout settlement logs along with platform commission fee reports (5-10%).
* `17_Transaction_History.png`: OPay-style master ledger recording every financial credit, debit, and escrow movement.
* `18_Admin_Settings.png`: Administrative controls for creating new admin accounts, managing roles, and updating API encryption keys.

---

## 6. KYC & Immutable Profile System

To eliminate fraud in the automotive market, PartMatch enforces a strict identity and document verification policy.

```
[ User Registers ]
        │
        ▼
[ Mandatory Profile & Phone OTP ]
        │
        ▼
[ Upload KYC Documents (NIN, CAC, License, Photos) ]
        │
        ▼
[ Account State: PENDING_VERIFICATION ] ──► (Blocked from accepting jobs or receiving payouts)
        │
        ▼
[ Admin Reviews Queue in R-05 Dashboard ]
    ├──► [ REJECTED ] ──► User notified with reason & allowed to re-upload
    └──► [ APPROVED ] ──► Account State: VERIFIED ──► Full Access Unlocked
                               │
                               ▼
                [ Critical Profile Fields Locked 🔒 ]
```

### Immutable Fields
Once an account achieves `VERIFIED` status, key identity fields are automatically **locked** and cannot be modified directly by the user:
* *R-01/R-02 Customer:* Legal Name, NIN Number.
* *R-03 Seller:* Business Store Name, CAC Registration Number, Warehouse Address, Verified Phone.
* *R-04 Mechanic:* Legal Name, NIN Number, Driver License Number, Trade Certificate ID.

### The Request Admin Change Workflow
If a verified user needs to update a locked field (e.g., change business telephone line or warehouse address):
1. The user navigates to the **Me Screen** and selects **Request Profile Change to Admin**.
2. The user submits the new value along with supporting documentation (e.g., official letterhead or updated utility bill).
3. The request enters the **R-05 Profile Change Requests Queue**.
4. An Admin reviews the submitted evidence and approves or rejects the change.
5. Upon approval, the database updates the locked field and logs the modification in the security audit trail.

---

## 7. Payment & Escrow System (Detailed Specification)

PartMatch integrates with premier African payment gateways (**Paystack** and **Flutterwave**) to execute escrow-secured transactions.

### Complete Transaction Lifecycle

```
[ Customer Orders Part ($140) + Installation ($15) ]
                        │
                        ▼
            [ Paystack / Flutterwave ]
                        │
                        ▼
      [ Funds Held in PartMatch Escrow Vault ]
          (State: SECURED_IN_ESCROW)
                        │
                        ▼
    [ Notification to Seller: "Safe to Ship" ]
                        │
                        ▼
     [ Seller Ships Part ──► State: SHIPPED ]
                        │
                        ▼
 [ Mechanic Completes Install ──► Uploads Proof ]
                        │
                        ▼
  [ Customer Test Drives & Enters Confirmation PIN ]
                        │
                        ▼
              [ Escrow Automated Release ]
    ┌───────────────────┼───────────────────┐
    │ 90-95%            │ 90-95%            │ 5-10%
    ▼                   ▼                   ▼
[ Seller Wallet ]   [ Mechanic Wallet ] [ Platform Revenue ]
 ($126 - $133)       ($13.50 - $14.25)    ($7.50 - $15.50)
```

### Escrow Transaction States
1. `PENDING_PAYMENT`: Order initiated; customer payment not yet confirmed.
2. `SECURED_IN_ESCROW`: Customer payment confirmed by gateway; funds locked in PartMatch escrow vault. Seller receives badge: *"Payment Secured in Escrow - Safe to Ship"*.
3. `SHIPPED`: Seller inputs tracking/waybill number; package in transit.
4. `DELIVERED`: Package received by customer or assigned mechanic.
5. `RELEASED`: Customer inspects part/installation and provides digital approval; funds split and credited to seller, mechanic, and platform revenue wallets.
6. `DISPUTED`: Customer raises complaint (e.g., fake part, missing delivery); funds frozen pending Admin mediation.

### Financial Structure & Wallet Architecture
* **Platform Commission Fee:** PartMatch retains a **5% to 10%** commission on completed sales and installation fees.
* **OPay-Style Dual Balance Display:**
  * **Available Balance:** Funds from completed, released transactions ready for instant withdrawal to Nigerian bank accounts.
  * **Escrow Holdings:** Active funds tied to in-progress orders. Displayed with a lock icon to maintain complete transparency.

---

## 8. Announcements & Support Engine

### Announcements Engine
Admin operators can broadcast announcements tailored to granular criteria:
* **Target Roles:** All Users, Drivers Only (R-01), Sellers Only (R-03), or Mechanics Only (R-04).
* **Geographic Targeting:** Nation-wide or State/City specific (e.g., Lagos Island, Ikeja, Abuja).
* **Verification Filtering:** Broadcast only to verified or pending accounts.
* **Delivery Formats:** In-app pop-up banner, dedicated Announcements Inbox, or Push Notification.

### Support & Escalation Engine
1. **Tier 1 (PartMatch AI Assistant):** Automated chatbot handles standard queries (order tracking, escrow status, return policies).
2. **Tier 2 (Human Support Escalation):** If the AI chatbot cannot resolve the issue or the user requests human assistance, the ticket is transferred to the **R-05 Support Chats Console**, where a human agent takes over the live conversation.

---

## 9. Security Center

PartMatch enforces enterprise-grade security protocols:
* **Two-Factor Authentication (2FA):** Mandatory TOTP / Authenticator App 2FA for all R-05 Admin Dashboard logins.
* **Role-Based Access Control (RBAC):** Strict database row-level security ensuring users can only read/write data permitted by their active role.
* **Audit Trail Logging:** Every admin override, profile change, dispute resolution, and escrow release is logged with timestamp, admin ID, and IP address.
* **Account Banning:** Admins can instantly flag and ban fraudulent accounts, revoking active JWT refresh tokens across all connected devices.

---

## 10. Build Stack Recommendation

To translate these specifications into a production platform, the following engineering stack is recommended:

### Mobile Applications (R-01, R-02, R-03, R-04)
* **Framework:** **React Native** (with Expo) or **Flutter**. React Native is recommended for rapid cross-platform component sharing across the 3 mobile apps.
* **State Management:** Zustand or Redux Toolkit.
* **Local UI Library:** Custom Tailwind CSS via NativeWind matching PartMatch design rules.
* **Device APIs:** Expo Camera (VIN & Part scanning), Expo Location (Mechanic GPS tracking), Push Notifications.

### Admin Web Dashboard (R-05)
* **Framework:** **Next.js 14** (App Router) or React + Vite.
* **UI & Styling:** Tailwind CSS, Lucide-React, Shadcn UI (customized to #FFFBF5 and #FF4D1A palette), Tremor / Recharts (for Analytics charts).

### Backend & Database Services
* **Core Backend / Database:** **Supabase** (PostgreSQL) or **Firebase**. Supabase is strongly recommended for native PostgreSQL Row-Level Security (RLS), built-in Auth, and real-time database subscriptions.
* **Serverless Edge Functions:** Node.js / TypeScript edge functions for escrow state transitions and payment webhook handling.
* **Transactional Email:** **Resend** or **SendGrid** for high-deliverability Email OTP codes and order receipts.
* **SMS Gateway:** Termii or Twilio (for phone verification during onboarding).
* **Object Storage:** Supabase Storage or AWS S3 for secure, encrypted storage of sensitive KYC documents (NIN, CAC certificates).
* **Maps & Navigation:** Google Maps API / Mapbox for real-time mechanic location tracking and distance calculation.

---
*PartMatch Master Product Specification v1.0 • Confidential and Proprietary*
