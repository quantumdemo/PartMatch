# PartMatch Code Commenting & Architecture Guide

## Core Architecture Principles
1. **Supabase First & Zero Raw SQL Concatenation**
   - Database queries must execute via Supabase Client parameterized SDK methods or SECURITY DEFINER stored procedures.
   - All balance mutations (debits, credits, payouts) are processed atomically via PL/pgSQL RPC calls with `FOR UPDATE` row locking.

2. **WAT Nigerian Timezone Formatting**
   - Stored timestamps in Supabase must remain UTC.
   - Display timestamps must render formatted in `Africa/Lagos` West Africa Time (WAT) via `formatWAT()`.

3. **Role Boundary Middleware Protection**
   - Access to `/admin/*` routes is strictly restricted to R-05 Admin roles.
   - Access to `/seller/*` routes is restricted to R-03 Seller roles.
   - Access to `/mechanic/*` routes is restricted to R-04 Mechanic roles.
   - Access to `/garage`, `/diagnose`, `/marketplace`, `/cart`, `/checkout` is restricted to R-01 Driver & R-02 Fleet roles.

4. **Mobile-First Layout Constraint**
   - All user-facing views for Driver, Seller, and Mechanic must use the container wrapper `max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen`.
   - Admin R-05 interface is desktop-responsive with a 240px fixed left sidebar.
