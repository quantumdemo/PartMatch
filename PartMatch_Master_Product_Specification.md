# PartMatch Master Product Specification

## 1. Project Overview

**PartMatch** is an end-to-end automotive commerce and mobile installation marketplace designed for the African automotive ecosystem, with an initial focus on Nigeria. The platform combines parts discovery, vehicle compatibility checks, escrow-supported payments, verified merchants, and on-demand mobile mechanic services.

### The Problem in Nigeria

The Nigerian automotive aftermarket faces three major challenges.

1. **Counterfeit and compatibility uncertainty:** Vehicle owners and fleet operators may purchase counterfeit, substandard, or incompatible parts, leading to breakdowns, safety risks, and repeated repair costs.
2. **Trust between merchants and customers:** Concerns about fraud and non-delivery make customers reluctant to pay in advance, while sellers may be unwilling to dispatch high-value items without payment assurance.
3. **Inconsistent mechanic quality:** Finding reliable, verified mobile mechanics who can diagnose faults and install parts to an acceptable standard can be difficult.

### The PartMatch Solution

PartMatch addresses these challenges through a multi-role marketplace built around verification, compatibility checks, payment protection, and service accountability.

- **Compatibility support:** Vehicle identification, OEM matching, and assisted part discovery help customers identify parts that fit their vehicles.
- **Escrow-supported payments:** Subject to the approved payment and legal operating model, funds are held until the relevant order or service milestones are met and the transaction is approved for release.
- **Verified service providers:** Identity and business verification checks help ensure that participating sellers and mechanics meet the platform's onboarding requirements.

### The Five Core Platform Roles

1. **R-01 Customer (Individual Driver):** Searches for parts through assisted diagnostics or manual OEM search, places protected orders, requests mobile mechanics, and confirms satisfactory delivery or installation.
2. **R-02 Vehicle Owner (Fleet Manager or Multi-Car Owner):** Manages multiple vehicles, monitors scheduled maintenance, tracks recurring orders, and manages driver assignments.
3. **R-03 Parts Seller (Auto Parts Merchant):** Manages inventory, creates listings, maintains product details, fulfils orders, supplies tracking information, and receives eligible payouts.
4. **R-04 Mobile Mechanic:** Receives nearby installation requests, accepts or declines jobs, navigates to customer locations, completes installation checklists, submits supporting evidence, and receives eligible service payments.
5. **R-05 Admin Owner (Platform Operator):** Uses the web-based administration dashboard to review verification requests, manage accounts, oversee disputes and payment releases, publish announcements, and monitor platform activity and financial reports.

---

## 2. Design System

PartMatch uses a minimalist, high-contrast, accessibility-focused design system across the mobile applications for R-01 through R-04 and the desktop web dashboard for R-05.

### Colour Palette

- **Background:** `#FFFBF5` — warm cream or off-white.
- **Card Surface:** `#FFFFFF` — white surfaces with subtle borders.
- **Primary Accent:** `#FF4D1A` — electric orange, reserved for primary call-to-action buttons, active states, and urgent primary indicators.
- **Primary Text:** `#0F172A` — dark slate for headings and key values.
- **Secondary Text:** `#64748B` — slate for labels, subheadings, and supporting information.
- **Border Lines:** `#E2E8F0` — light structural dividers.
- **Muted Background:** `#F8FAFC` — subdued backgrounds for form fields and table rows.
- **Success:** `#15803D` text with `#DCFCE7` fill.
- **Warning or Escrow Pending:** `#B45309` text with `#FEF3C7` fill.
- **Error or Urgent:** `#B91C1C` text with `#FEE2E2` fill.

### Visual Rules and Constraints

- **Gradients:** Do not use gradients. Maintain a clean visual hierarchy and consistent rendering.
- **Icons:** Do not use emojis. Use Lucide line icons consistently.
- **Border radius:** Use 16px for cards, containers, and elevated surfaces. Use 12px for buttons.
- **Typography and metrics:** Display important figures, including daily sales, job prices, escrow holdings, and user totals, with prominent typography such as `text-3xl` or `text-4xl` and a strong font weight.
- **Micro-animations:** Keep hover, pressed, and loading transitions subtle, generally between 150ms and 300ms.
- **Complete data states:** Every screen with dynamic lists must support loading, empty, and error or offline states. Empty states should explain what the user can do next and include a relevant action where appropriate.
- **Mobile header:** Show the active screen title, Help icon, and Notification icon. Unread notifications should be clearly indicated.
- **Mobile bottom navigation:** Use a persistent four- or five-tab navigation appropriate to each role. Seller navigation may include Dashboard, Inventory, Orders, Wallet, and Me. Mechanic navigation may include Jobs, Map, Earnings, and Me.
- **Desktop navigation:** Use a persistent vertical sidebar with expanded and collapsed states.

---

## 3. Authentication Flow

PartMatch requires a secure, multi-tiered authentication architecture that considers reliability and operating costs in West Africa.

### Sign-Up Options

Users may register through Google OAuth, Apple ID, or an email address, subject to the selected authentication provider and platform support.

### Email OTP and SMS OTP

- **Email verification:** Use a six-digit numeric one-time password delivered through a transactional email provider such as Resend or SendGrid. Email verification is the primary account verification step because SMS delivery can be delayed, blocked, or expensive on some networks.
- **Phone verification:** Use SMS OTP only as a secondary verification step during mandatory profile completion. Phone verification supports reliable contact for delivery, orders, and mechanic services. Phone numbers are not the primary login credential under this proposed flow.

### Step-by-Step Authentication Flow

1. **Role Selection:** The user selects a role: Customer Driver, Fleet Owner, Parts Seller, or Mobile Mechanic.
2. **Identity Provider or Email Entry:** The user chooses Google, Apple, or email registration.
3. **Email OTP Verification:** The user enters the six-digit code delivered to their email.
4. **Password Setup:** Where password-based authentication is used, the user creates a strong password. The proposed minimum is eight characters, including a number and a special character.
5. **Mandatory Role Profile:** The user supplies the required details for their selected role.
   - **R-01 and R-02:** Full name, residential address, phone number, and primary vehicle details where applicable.
   - **R-03 Seller:** Store name, CAC registration details where applicable, warehouse address, and verified phone number.
   - **R-04 Mechanic:** Full name, service radius, years of experience, work or workshop photos, and required credentials.
6. **Session and Token Management:** The proposed architecture uses short-lived access tokens and securely managed refresh tokens. A target access-token lifetime is 15 minutes, with refresh-token rotation and a target maximum lifetime of 30 days. Final settings must follow the selected identity provider and security review.

---

## 4. R-01 and R-02 Onboarding: Driver and Fleet Garage

The onboarding flow guides customers towards creating a digital vehicle garage so that the platform can provide more relevant compatibility information.

### Onboarding Steps

1. **Welcome Screens:** Explain assisted diagnosis, payment protection, and mobile mechanic installation.
2. **VIN Scanning and Registration Lookup:** Users may scan a vehicle identification number (VIN) or enter the 17-character VIN manually. Where supported by reliable data providers, they may also enter a Nigerian vehicle registration number.
3. **Vehicle Identification:** An integrated vehicle data service may return details such as model year, make, model, engine type, fuel type, and transmission. Results should be presented for user confirmation because data coverage and decoding accuracy may vary.
4. **Garage Management:**
   - Individual drivers (R-01) may save one to three personal vehicles under the proposed product limits.
   - Fleet owners (R-02) may manage larger collections of commercial vehicles and group them into categories such as delivery vans or corporate sedans.
5. **Compatible Parts Intelligence:** Marketplace listings should be checked against the active vehicle's recorded specifications and available OEM data.
6. **Fitment Feedback:** Display a clear compatibility status. Use a “100% Fits Your Vehicle” label only where the platform has sufficiently reliable, verified fitment data. If compatibility is uncertain or a part is incompatible, explain the uncertainty and prevent checkout when the risk requires it.

---

## 5. Role-by-Role UI Breakdown

The design scope contains **86 screens** across four role groups. Screen names below are logical identifiers for the design files and implementation references.

### Group 1: R-01 Driver and R-02 Fleet Owner — 38 Screens

1. `01RoleSelect`: Select a role: Driver, Fleet, Seller, or Mechanic.
2. `02SignUpMethod`: Choose Google, Apple, or email registration.
3. `03EmailCodeVerify`: Enter the six-digit email verification code.
4. `04SetPassword`: Create a password with a strength indicator.
5. `05CompleteProfile`: Enter personal details, address, and phone verification information.
6. `06ProfilePhotoCheck`: Capture a selfie for profile validation where required.
7. `07KYCUpload`: Upload the required identity document, such as a NIN slip.
8. `08HomeHappy`: Main driver dashboard with active vehicle, search, category shortcuts, and popular parts.
9. `09HomeSkeleton`: Loading state for the home dashboard.
10. `10GarageList`: View saved vehicles and select the active vehicle.
11. `11GarageEmpty`: Explain how to add the first vehicle.
12. `12AddVehicleForm`: Enter vehicle make, model, year, trim, and engine details.
13. `13AddVehicleSuccess`: Confirm that a vehicle has been added.
14. `14DiagnoseMethod`: Choose a diagnostic method, such as audio-assisted, photo-assisted, or manual symptom selection.
15. `15AIScanning`: Show progress while diagnostic input is being processed.
16. `16AIResult`: Present a possible fault and recommended replacement parts, with appropriate uncertainty warnings.
17. `17VerifyFitment`: Check part specifications against the vehicle record or VIN data.
18. `18ManualSearchFallback`: Search and filter the parts catalogue manually.
19. `19CompareSellers`: Compare sellers by price, delivery estimate, and rating.
20. `20SellerProfile`: Show a merchant's profile, rating, location, and inventory.
21. `21Cart`: Display selected parts, optional installation services, and the subtotal.
22. `22CheckoutEscrow`: Summarise the order and explain the proposed payment-protection terms.
23. `23PaymentMethod`: Choose a supported payment method, such as debit card, bank transfer, or USSD through an integrated gateway.
24. `24OrderPlaced`: Confirm order placement and show the applicable payment status.
25. `25OrderTracking`: Show delivery progress, courier information, and status history.
26. `26FindMechanics`: List available, verified mobile mechanics near the customer.
27. `27MechanicsEmpty`: Explain when no mechanics are available within the selected search radius.
28. `28MechanicProfile`: Show a mechanic's experience, certifications, rates, and customer reviews.
29. `29MechanicOnWay`: Display the accepted mechanic's route and estimated arrival where live tracking is supported.
30. `30InstallChecklist`: Show the installation steps being completed by the mechanic.
31. `31CustomerConfirm`: Let the customer inspect the part or installation, test the vehicle where appropriate, and confirm completion securely.
32. `32PaymentReleased`: Confirm that the relevant payment release has been processed.
33. `33WalletOPayStyle`: Display wallet balances, transaction records, and refund history where wallet functionality is supported.
34. `34OrdersHistory`: Separate active, completed, and disputed orders.
35. `35MeOPayPattern`: Customer profile and account settings using a clear, familiar wallet-style layout.
36. `36ProfileLocked`: Show protected profile fields and an option to request an administrator-approved change.
37. `37Announcements`: Display platform announcements and policy updates.
38. `38SupportChat`: Provide customer support with an option to escalate from automated assistance to a human agent.

### Group 2: R-03 Parts Seller — 16 Screens

1. `01_SignUp`: Register a seller account with store name, applicable CAC details, warehouse address, and phone verification.
2. `02_KYC_Mandatory`: Upload required identity, business, store, and address documents. Display the verification status.
3. `03_Dashboard_Happy`: Seller dashboard with daily sales, secured funds, pending shipments, and relevant announcements. Any sample figures used in design previews must be clearly identified as illustrative.
4. `04_Dashboard_Empty_Skeleton`: Show loading placeholders and an empty state with guidance to add the first part.
5. `05_Inventory_List`: Display part name, SKU, stock quantity, price, condition, OEM or aftermarket classification, and edit actions.
6. `06_Inventory_Empty`: Explain how to create the first inventory listing.
7. `07_Add_Part`: Create a listing with part photos, OEM details, price, condition, stock, and compatible vehicles. Assisted auto-fill must be confirmed by the seller.
8. `08_Edit_Part_Locked`: Show protected OEM and fitment fields after verification, with a request-to-change workflow.
9. `09_Orders_List`: Show incoming orders and a clear payment status. Dispatch must only be enabled after payment confirmation is verified by the backend.
10. `10_Order_Detail`: Display customer vehicle specifications, ordered parts, payment state, and courier tracking input.
11. `11_Order_Tracking`: Show the delivery progress for the seller's dispatched orders.
12. `12_Wallet`: Display available balance, funds pending release, transaction history, and withdrawal options.
13. `13_Me_Screen`: Show store profile, security settings, bank details, and protected profile fields.
14. `14_KYC_Status`: Display the verification status of business, store, and identity documents.
15. `15_Announcements_Inbox`: Show announcements intended for parts sellers.
16. `16_Support_Chat`: Provide seller support and escalation to a human agent.

### Group 3: R-04 Mobile Mechanic — 14 Screens

1. `01_SignUp`: Register with name, phone verification, service radius, experience, and work photos.
2. `02_KYC_Mandatory`: Upload the required identity, driving, trade, and profile documents. Explain that job acceptance is restricted until verification is approved.
3. `03_Jobs_List_Happy`: Show nearby jobs with distance, vehicle, required work, service fee, and accept or reject actions.
4. `04_Jobs_Empty_Skeleton`: Show loading placeholders and an empty state with an option to go online.
5. `05_Job_Detail`: Display job details and customer location. Reveal protected contact information only when permitted by the job workflow.
6. `06_Job_Accepted_Navigation`: Show the route to the customer and estimated arrival where navigation services are available.
7. `07_Arrived_Start_Installation`: Confirm arrival and prompt the mechanic to verify the customer before starting work.
8. `08_Installation_Checklist`: Provide a step-by-step installation checklist and require relevant photo or video evidence where appropriate.
9. `09_Waiting_Customer_Confirmation`: Show that the job is awaiting customer confirmation and that payment remains pending release.
10. `10_Earnings_Wallet`: Display daily earnings, pending amounts, completed jobs, and withdrawal options.
11. `11_Me_Screen`: Show mechanic profile, security settings, bank details, and protected profile fields.
12. `12_Announcements`: Show announcements targeted to the mechanic's region or role.
13. `13_Support_Chat`: Provide support for mechanics.
14. `14_Job_History_Ratings`: Show completed jobs, customer feedback, and ratings.

### Group 4: R-05 Admin Web Dashboard — 18 Screens

1. `01_Admin_Login`: Secure desktop login with email, password, and mandatory two-factor authentication. Exclude public registration and social sign-in.
2. `02_Analytics_Dashboard`: Display total users, funds held in the platform's supported payment arrangement, daily orders, verification metrics, and charts. Any figures shown in design previews must be marked as illustrative.
3. `03_Users_List`: Manage users by role, search globally, display verification badges, and support loading states.
4. `04_User_Detail_Override`: Inspect user profiles, apply authorised administrative changes, or suspend accounts with audit logging.
5. `05_KYC_Verification_Queue`: Review identity and business documents and approve or reject them with a recorded reason.
6. `06_Profile_Change_Requests`: Review requests to update protected profile details.
7. `07_Escrow_Holdings`: Monitor transaction states and authorised payment-release actions. Manual release must require permissions, justification, and an audit record.
8. `08_Orders_Management`: Oversee orders, courier tracking details, and permitted delivery-resolution actions.
9. `09_Dispute_Center`: Review customer and seller communications, submitted evidence, and resolution options such as refund or payment release.
10. `10_Inventory_Oversight`: Inspect listings and flag suspected counterfeit or misleading products.
11. `11_Mechanic_Jobs_Oversight`: Monitor active mechanic jobs and locations where tracking is enabled and consented to.
12. `12_Announcements_Create`: Create announcements for all users, selected roles, or selected locations.
13. `13_Announcements_History`: Review sent announcements and delivery metrics.
14. `14_Support_Chats`: Manage support tickets escalated from automated assistance.
15. `15_Security_Center`: Review login audit records, security events, failed two-factor attempts, and suspended accounts.
16. `16_Payouts`: Review seller and mechanic settlements and platform commission reports.
17. `17_Transaction_History`: Review financial credits, debits, refunds, and payment-state changes.
18. `18_Admin_Settings`: Manage administrator accounts, roles, permissions, and securely stored integration settings.

---

## 6. KYC and Protected Profile Fields

PartMatch uses identity and document verification to reduce fraud and establish accountability.

### Proposed Verification Workflow

```text
User registers
      |
      v
Mandatory profile completion and phone verification
      |
      v
Upload required verification documents
      |
      v
Account status: PENDING_VERIFICATION
      |
      v
Administrator reviews the verification queue
      |
      +---- Rejected: notify the user, explain the reason, and allow resubmission
      |
      +---- Approved: set account status to VERIFIED and enable permitted features
                         |
                         v
                 Protect critical profile fields
```

Features such as accepting mechanic jobs, listing products, or receiving payouts should remain restricted until the relevant verification requirements are met. Restrictions must be role-specific.

### Protected Fields

Once verification is approved, selected identity and business fields become protected from direct user edits.

- **R-01 and R-02 Customer:** Legal name and NIN details, where collected and legally required.
- **R-03 Seller:** Registered business or store name, CAC details where applicable, warehouse address, and verified phone number.
- **R-04 Mechanic:** Legal name, NIN details where required, driving licence details where applicable, and trade certification details.

Sensitive identity information must be collected only when necessary, stored securely, and handled according to applicable data protection requirements.

### Administrator-Approved Change Workflow

1. The verified user opens the Me screen and selects the option to request a profile change.
2. The user submits the proposed new value and supporting evidence where required.
3. The request appears in the R-05 profile-change queue.
4. An authorised administrator reviews the request and approves or rejects it with a recorded reason.
5. If approved, the system updates the protected field and records the change in the security audit trail.

---

## 7. Payments and Escrow Model

PartMatch is designed to integrate with payment providers such as Paystack and Flutterwave. The actual handling of customer funds must be confirmed with the selected provider and reviewed for compliance with applicable Nigerian financial services, consumer protection, and payment regulations. The product must not describe funds as legally held in escrow unless the implemented arrangement genuinely supports that claim.

### Proposed Transaction Lifecycle

```text
Customer orders a part and, optionally, installation
                         |
                         v
             Payment provider processes payment
                         |
                         v
          Backend verifies the payment confirmation
                         |
                         v
       Transaction enters the approved secured-payment state
                         |
                         v
        Seller is authorised to dispatch the part
                         |
                         v
          Part is dispatched and delivery is tracked
                         |
                         v
       Mechanic completes installation, where applicable
                         |
                         v
        Customer confirms the applicable milestones
                         |
                         v
       Payment is released or settled under the approved model
```

Payment release, refunds, chargebacks, and dispute handling must be implemented through verified server-side events and the approved payment provider arrangement. A user interface must never be able to release funds merely by changing a client-side status.

### Transaction States

1. `PENDING_PAYMENT`: The order has been initiated, but payment has not been verified.
2. `SECURED_IN_ESCROW`: Use this state only if the approved payment arrangement genuinely supports escrow. Otherwise, use a state name that accurately reflects the provider's payment status.
3. `SHIPPED`: The seller has supplied dispatch details and the item is in transit.
4. `DELIVERED`: Delivery has been confirmed by the applicable process.
5. `RELEASED`: The transaction has been approved for settlement and the relevant payment provider confirms the outcome.
6. `DISPUTED`: A complaint has been raised and the relevant funds or settlement process are restricted where the provider and legal arrangement permit.

State transitions must be validated on the server, idempotent where appropriate, and recorded for audit and reconciliation.

### Commission and Wallet Design

- **Proposed platform commission:** 5% to 10% of eligible completed sales and installation fees. The exact rate, calculation basis, taxes, provider charges, and refund treatment must be defined in the commercial policy.
- **Available balance:** Funds confirmed as available for withdrawal or settlement.
- **Pending or restricted balance:** Amounts associated with transactions that have not yet become eligible for payout. Label this according to the actual payment arrangement rather than implying escrow where it does not exist.
- **Transaction history:** Show credits, debits, fees, refunds, withdrawals, and relevant transaction statuses.

Illustrative values in design previews must not be presented as live financial data. Seller and mechanic allocations must be calculated from the actual order amounts and documented commission rules rather than hard-coded examples.

---

## 8. Announcements and Support

### Announcements Engine

Administrators may target announcements using the following criteria:

- **Role:** All users, drivers, sellers, mechanics, or other authorised groups.
- **Location:** Nationwide or selected states and cities, such as Lagos, Ikeja, or Abuja.
- **Verification status:** Verified users, pending users, or other eligible account groups.
- **Delivery channel:** In-app banner, announcements inbox, or push notification where supported.

The system should record announcement creation, target criteria, publication status, and delivery metrics where available.

### Support and Escalation Engine

1. **Tier 1: PartMatch Assistant.** Automated support can answer approved common questions about order tracking, payment status, and platform policies.
2. **Tier 2: Human Support.** If the automated assistant cannot resolve an issue, or the user requests a person, the conversation is routed to the R-05 support console.

Automated support must not make binding decisions about disputes, refunds, identity verification, or payment releases unless an explicitly authorised and audited workflow permits it.

---

## 9. Security Centre

PartMatch should implement security controls appropriate to the sensitivity of identity documents, customer locations, and financial transactions.

- **Administrator two-factor authentication:** Require authenticator-based or equivalent strong two-factor authentication for all R-05 administrator accounts.
- **Role-based access control:** Enforce server-side permissions and database-level access policies so users can access only the information and actions permitted for their roles.
- **Audit logging:** Record administrator overrides, profile changes, verification decisions, dispute outcomes, and payment-state changes with timestamps, actor identifiers, and relevant security metadata.
- **Account suspension:** Allow authorised administrators to suspend accounts and revoke active sessions or refresh tokens.
- **Secrets management:** Store API keys and other credentials in a secure server-side secrets manager. Do not expose private keys or sensitive integration credentials in client code.
- **Sensitive document storage:** Restrict access to identity and business documents, use appropriate encryption and retention controls, and log access where feasible.
- **Privacy and data protection:** Apply data minimisation, consent and notice requirements, access controls, and retention policies consistent with applicable law.
- **Payment integrity:** Verify provider webhooks, authenticate requests, prevent replay and duplicate processing, and reconcile payment records.

---

## 10. Recommended Technology Stack

The final stack should be selected according to the team's skills, delivery targets, operating costs, security requirements, and the need to support Android, iOS, and web interfaces.

### Mobile Applications: R-01, R-02, R-03, and R-04

- **Framework:** React Native with Expo or Flutter. React Native with Expo is a strong option where shared TypeScript components and rapid cross-platform development are priorities.
- **State management:** Zustand or Redux Toolkit.
- **UI styling:** NativeWind or a consistent custom component system that follows the PartMatch design rules.
- **Device capabilities:** Camera access for VIN and part capture, location services for mechanic availability and navigation, and push notifications.

### Admin Web Dashboard: R-05

- **Framework:** Next.js App Router or React with Vite.
- **UI and styling:** Tailwind CSS, Lucide icons, and a customised component library such as shadcn/ui.
- **Analytics:** Recharts or another suitable charting library.

### Backend and Data Services

- **Database and backend:** Supabase with PostgreSQL is recommended for relational data, row-level security, authentication integration, and real-time features. Firebase is an alternative if its data model and security approach better suit the implementation.
- **Server-side functions:** Node.js and TypeScript functions for payment webhooks, order-state transitions, notifications, and privileged operations.
- **Transactional email:** Resend or SendGrid for verification codes and order communications.
- **SMS verification:** Termii or Twilio, subject to delivery coverage and cost evaluation.
- **Object storage:** Supabase Storage or AWS S3 for protected KYC documents and user uploads.
- **Maps and navigation:** Google Maps Platform or Mapbox for distance calculations, maps, and mechanic navigation.
- **Vehicle and parts data:** Integrate reputable vehicle decoding and parts-fitment data providers. Make data provenance and confidence visible where relevant.

### Implementation Principles

1. Treat the specification as a product target, not proof that every feature has already been implemented.
2. Keep payment, verification, permission, and order-state decisions on the server.
3. Do not use hard-coded sample figures as live data.
4. Distinguish working integrations from simulated or planned capabilities.
5. Test all roles, critical flows, loading states, empty states, errors, offline behaviour, and responsive layouts before release.
6. Review payment handling, identity verification, privacy, and regulatory obligations before launch.

---

*PartMatch Master Product Specification — Confidential and Proprietary*
