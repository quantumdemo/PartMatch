-- Migration: PartMatch Stage 1 Schema, RLS Policies, and Atomic Wallet RPCs
-- Created for PartMatch production setup - STAGE 1

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. ENUMS & CONSTANTS
-- ==========================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'mechanic', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE kyc_status_type AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('INFLOW', 'OUTFLOW');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_category AS ENUM (
        'FUND_WALLET',
        'ESCROW_FUND',
        'ESCROW_RELEASE',
        'ESCROW_REFUND',
        'PAYOUT_SELLER',
        'PAYOUT_MECHANIC',
        'WITHDRAWAL',
        'PLATFORM_FEE',
        'REFUND'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('SUCCESS', 'PENDING', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE escrow_status_type AS ENUM (
        'PENDING_PAYMENT',
        'SECURED_IN_ESCROW',
        'SHIPPED',
        'DELIVERED',
        'DISPUTED',
        'RELEASED',
        'REFUNDED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status_type AS ENUM (
        'PENDING',
        'PAID',
        'DISPATCHED',
        'DELIVERED',
        'COMPLETED',
        'CANCELLED',
        'DISPUTED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_status_type AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- ==========================================
-- 2. TABLES
-- ==========================================

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'buyer',
    avatar_url TEXT,
    live_verified BOOLEAN NOT NULL DEFAULT FALSE,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    formatted_address TEXT,
    terms_accepted_at TIMESTAMPTZ,
    kyc_status kyc_status_type NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.profiles IS 'Stores user profile details including assigned role, live verification status, location coordinates, and onboarding KYC status.';
COMMENT ON COLUMN public.profiles.terms_accepted_at IS 'Timestamp in UTC indicating when terms were accepted. Always displayed in Africa/Lagos (WAT) on client apps.';

-- KYC SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.kyc_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    nin TEXT,
    cac TEXT,
    store_photo TEXT,
    proof_address TEXT,
    trade_cert TEXT,
    live_verification_image TEXT,
    nin_photo TEXT,
    status kyc_status_type NOT NULL DEFAULT 'PENDING',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.kyc_submissions IS 'Stores user identification documents, business CAC filings, store/trade photos, and verification status for administrative review.';

-- WALLETS TABLE
CREATE TABLE IF NOT EXISTS public.wallets (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    available_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (available_balance >= 0),
    escrow_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (escrow_balance >= 0),
    total_earned NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (total_earned >= 0),
    total_spent NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (total_spent >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'NGN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.wallets IS 'Stores financial balances per user in NGN currency. available_balance = withdrawable, escrow_balance = locked in transaction/order escrow.';

-- TRANSACTIONS TABLE (IMMUTABLE LEDGER)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    type transaction_type NOT NULL,
    category transaction_category NOT NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    balance_before NUMERIC(15, 2) NOT NULL,
    balance_after NUMERIC(15, 2) NOT NULL,
    reference VARCHAR(64) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    order_id UUID,
    escrow_id UUID,
    status transaction_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.transactions IS 'IMMUTABLE financial ledger recording all inflows, outflows, escrow locks, and payouts. NEVER UPDATE OR DELETE rows in production.';

-- ESCROW HOLDINGS TABLE
CREATE TABLE IF NOT EXISTS public.escrow_holdings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID,
    buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    seller_id UUID REFERENCES auth.users(id) ON DELETE RESTRICT,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    fee NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (fee >= 0),
    status escrow_status_type NOT NULL DEFAULT 'PENDING_PAYMENT',
    release_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.escrow_holdings IS 'Tracks funds locked in escrow for specific buyer-seller/mechanic orders until release conditions or release_at (WAT) expiry are satisfied.';

-- PAYMENT PINS TABLE
CREATE TABLE IF NOT EXISTS public.payment_pins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    pin_hash TEXT NOT NULL,
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.payment_pins IS 'Stores bcrypt hashed 4-digit or 6-digit transaction authorization PINs along with security lockout counters. bcrypt hash never plain.';

-- PIN CHANGE LOGS TABLE
CREATE TABLE IF NOT EXISTS public.pin_change_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.pin_change_logs IS 'Audit history of payment PIN creations, updates, and resets for fraud prevention and security monitoring.';

-- BANK ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bank_code VARCHAR(20) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    account_name VARCHAR(150) NOT NULL,
    recipient_code VARCHAR(100),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.bank_accounts IS 'Verified Nigerian bank accounts for seller and mechanic withdrawal payouts processed via Paystack recipient codes.';

-- PROFILE CHANGE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.profile_change_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT NOT NULL,
    reason TEXT NOT NULL,
    status request_status_type NOT NULL DEFAULT 'PENDING',
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.profile_change_requests IS 'Workflow queue for requesting modifications to locked verified profile fields (e.g., CAC, store name, legal name). Requires admin approval.';

-- PLATFORM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.platform_settings IS 'Global dynamic configuration settings (e.g., escrow fee percentages, system maintenance mode, payout minimum thresholds).';

-- PRODUCT CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.product_categories IS 'Categorization taxonomy for automotive spare parts and diagnostic service offerings.';

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    description TEXT NOT NULL,
    price NUMERIC(15, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    condition VARCHAR(50) NOT NULL DEFAULT 'NEW',
    oem_number VARCHAR(100),
    compatible_vehicles JSONB NOT NULL DEFAULT '[]'::jsonb,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.products IS 'Verified automotive parts inventory items offered by sellers (R-03) with vehicle compatibility matrices.';

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    seller_id UUID REFERENCES auth.users(id) ON DELETE RESTRICT,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(15, 2) NOT NULL CHECK (unit_price >= 0),
    total_amount NUMERIC(15, 2) NOT NULL CHECK (total_amount >= 0),
    status order_status_type NOT NULL DEFAULT 'PENDING',
    shipping_address TEXT NOT NULL,
    courier_tracking_code VARCHAR(100),
    escrow_id UUID REFERENCES public.escrow_holdings(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.orders IS 'Customer orders for spare parts and installation services linked to escrow holds and transaction history.';


-- ==========================================
-- 3. IMMUTABILITY ENFORCEMENT ON TRANSACTIONS
-- ==========================================

CREATE OR REPLACE FUNCTION public.prevent_transaction_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Transactions are immutable ledger records. UPDATE or DELETE operations are strictly forbidden.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_transaction_update_delete ON public.transactions;
CREATE TRIGGER trg_prevent_transaction_update_delete
BEFORE UPDATE OR DELETE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.prevent_transaction_modification();


-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Helper function to check if auth.uid() is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on every single table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pin_change_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;


-- 4.1 PROFILES POLICIES
DROP POLICY IF EXISTS "Users can view own profile or admins view all" ON public.profiles;
CREATE POLICY "Users can view own profile or admins view all" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());


-- 4.2 KYC SUBMISSIONS POLICIES
DROP POLICY IF EXISTS "Users can view own KYC or admins view all" ON public.kyc_submissions;
CREATE POLICY "Users can view own KYC or admins view all" ON public.kyc_submissions
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can submit own KYC" ON public.kyc_submissions;
CREATE POLICY "Users can submit own KYC" ON public.kyc_submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update KYC status" ON public.kyc_submissions;
CREATE POLICY "Admins can update KYC status" ON public.kyc_submissions
    FOR UPDATE USING (public.is_admin());


-- 4.3 WALLETS POLICIES
DROP POLICY IF EXISTS "Users can view own wallet or admins view all" ON public.wallets;
CREATE POLICY "Users can view own wallet or admins view all" ON public.wallets
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());


-- 4.4 TRANSACTIONS POLICIES
DROP POLICY IF EXISTS "Users can view own transactions or admins view all" ON public.transactions;
CREATE POLICY "Users can view own transactions or admins view all" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());


-- 4.5 ESCROW HOLDINGS POLICIES
DROP POLICY IF EXISTS "Parties or admin can view escrow holdings" ON public.escrow_holdings;
CREATE POLICY "Parties or admin can view escrow holdings" ON public.escrow_holdings
    FOR SELECT USING (
        auth.uid() = buyer_id OR
        auth.uid() = seller_id OR
        public.is_admin()
    );


-- 4.6 PAYMENT PINS POLICIES (EXCLUDE DIRECT SELECT OF pin_hash TO CLIENT)
DROP POLICY IF EXISTS "Users can view own payment pin status" ON public.payment_pins;
CREATE POLICY "Users can view own payment pin status" ON public.payment_pins
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own payment pin" ON public.payment_pins;
CREATE POLICY "Users can insert own payment pin" ON public.payment_pins
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own payment pin" ON public.payment_pins;
CREATE POLICY "Users can update own payment pin" ON public.payment_pins
    FOR UPDATE USING (auth.uid() = user_id);


-- 4.7 PIN CHANGE LOGS POLICIES
DROP POLICY IF EXISTS "Users can view own pin change logs" ON public.pin_change_logs;
CREATE POLICY "Users can view own pin change logs" ON public.pin_change_logs
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can log pin changes" ON public.pin_change_logs;
CREATE POLICY "Users can log pin changes" ON public.pin_change_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 4.8 BANK ACCOUNTS POLICIES
DROP POLICY IF EXISTS "Users can manage own bank accounts or admin view" ON public.bank_accounts;
CREATE POLICY "Users can manage own bank accounts or admin view" ON public.bank_accounts
    FOR ALL USING (auth.uid() = user_id OR public.is_admin());


-- 4.9 PROFILE CHANGE REQUESTS POLICIES
DROP POLICY IF EXISTS "Users can view own change requests or admin view all" ON public.profile_change_requests;
CREATE POLICY "Users can view own change requests or admin view all" ON public.profile_change_requests
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can submit change requests" ON public.profile_change_requests;
CREATE POLICY "Users can submit change requests" ON public.profile_change_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update change requests" ON public.profile_change_requests;
CREATE POLICY "Admins can update change requests" ON public.profile_change_requests
    FOR UPDATE USING (public.is_admin());


-- 4.10 PLATFORM SETTINGS POLICIES
DROP POLICY IF EXISTS "Anyone authenticated can read platform settings" ON public.platform_settings;
CREATE POLICY "Anyone authenticated can read platform settings" ON public.platform_settings
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can update platform settings" ON public.platform_settings;
CREATE POLICY "Admins can update platform settings" ON public.platform_settings
    FOR ALL USING (public.is_admin());


-- 4.11 PRODUCT CATEGORIES POLICIES
DROP POLICY IF EXISTS "Anyone can view product categories" ON public.product_categories;
CREATE POLICY "Anyone can view product categories" ON public.product_categories
    FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Admins can modify product categories" ON public.product_categories;
CREATE POLICY "Admins can modify product categories" ON public.product_categories
    FOR ALL USING (public.is_admin());


-- 4.12 PRODUCTS POLICIES
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT USING (is_active = TRUE OR auth.uid() = seller_id OR public.is_admin());

DROP POLICY IF EXISTS "Sellers can manage own products" ON public.products;
CREATE POLICY "Sellers can manage own products" ON public.products
    FOR ALL USING (auth.uid() = seller_id OR public.is_admin());


-- 4.13 ORDERS POLICIES
DROP POLICY IF EXISTS "Buyer, Seller, or Admin can view order" ON public.orders;
CREATE POLICY "Buyer, Seller, or Admin can view order" ON public.orders
    FOR SELECT USING (
        auth.uid() = buyer_id OR
        auth.uid() = seller_id OR
        public.is_admin()
    );

DROP POLICY IF EXISTS "Buyer can create order" ON public.orders;
CREATE POLICY "Buyer can create order" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Buyer, Seller, or Admin can update order" ON public.orders;
CREATE POLICY "Buyer, Seller, or Admin can update order" ON public.orders
    FOR UPDATE USING (
        auth.uid() = buyer_id OR
        auth.uid() = seller_id OR
        public.is_admin()
    );


-- ==========================================
-- 5. RPC SECURITY DEFINER ATOMIC FUNCTIONS WITH AUTHORIZATION
-- ==========================================

-- Function: create_transaction
CREATE OR REPLACE FUNCTION public.create_transaction(
    p_user_id UUID,
    p_type transaction_type,
    p_category transaction_category,
    p_amount NUMERIC,
    p_balance_before NUMERIC,
    p_balance_after NUMERIC,
    p_reference TEXT,
    p_description TEXT,
    p_order_id UUID DEFAULT NULL,
    p_escrow_id UUID DEFAULT NULL,
    p_status transaction_status DEFAULT 'SUCCESS'
)
RETURNS public.transactions AS $$
DECLARE
    v_transaction public.transactions;
BEGIN
    -- Authorization Check
    IF auth.uid() IS NOT NULL AND auth.uid() <> p_user_id AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Cannot create transaction for another user.';
    END IF;

    INSERT INTO public.transactions (
        user_id,
        type,
        category,
        amount,
        balance_before,
        balance_after,
        reference,
        description,
        order_id,
        escrow_id,
        status
    ) VALUES (
        p_user_id,
        p_type,
        p_category,
        p_amount,
        p_balance_before,
        p_balance_after,
        p_reference,
        p_description,
        p_order_id,
        p_escrow_id,
        p_status
    )
    RETURNING * INTO v_transaction;

    RETURN v_transaction;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Function: credit_wallet
CREATE OR REPLACE FUNCTION public.credit_wallet(
    p_user_id UUID,
    p_amount NUMERIC,
    p_category transaction_category,
    p_reference TEXT,
    p_description TEXT,
    p_order_id UUID DEFAULT NULL,
    p_escrow_id UUID DEFAULT NULL
)
RETURNS public.wallets AS $$
DECLARE
    v_wallet public.wallets;
    v_balance_before NUMERIC;
    v_balance_after NUMERIC;
BEGIN
    -- Authorization Check
    IF auth.uid() IS NOT NULL AND auth.uid() <> p_user_id AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Cannot credit another user wallet.';
    END IF;

    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Credit amount must be greater than zero.';
    END IF;

    -- Ensure wallet exists with row lock
    SELECT * INTO v_wallet
    FROM public.wallets
    WHERE user_id = p_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        INSERT INTO public.wallets (user_id, available_balance, escrow_balance, total_earned, total_spent)
        VALUES (p_user_id, 0.00, 0.00, 0.00, 0.00)
        RETURNING * INTO v_wallet;
    END IF;

    v_balance_before := v_wallet.available_balance;
    v_balance_after := v_balance_before + p_amount;

    UPDATE public.wallets
    SET
        available_balance = v_balance_after,
        total_earned = CASE
            WHEN p_category IN ('ESCROW_RELEASE', 'PAYOUT_SELLER', 'PAYOUT_MECHANIC', 'FUND_WALLET')
            THEN total_earned + p_amount
            ELSE total_earned
        END,
        updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING * INTO v_wallet;

    PERFORM public.create_transaction(
        p_user_id,
        'INFLOW',
        p_category,
        p_amount,
        v_balance_before,
        v_balance_after,
        p_reference,
        p_description,
        p_order_id,
        p_escrow_id,
        'SUCCESS'
    );

    RETURN v_wallet;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Function: debit_wallet
CREATE OR REPLACE FUNCTION public.debit_wallet(
    p_user_id UUID,
    p_amount NUMERIC,
    p_category transaction_category,
    p_reference TEXT,
    p_description TEXT,
    p_order_id UUID DEFAULT NULL,
    p_escrow_id UUID DEFAULT NULL,
    p_lock_in_escrow BOOLEAN DEFAULT FALSE
)
RETURNS public.wallets AS $$
DECLARE
    v_wallet public.wallets;
    v_balance_before NUMERIC;
    v_balance_after NUMERIC;
BEGIN
    -- Authorization Check
    IF auth.uid() IS NOT NULL AND auth.uid() <> p_user_id AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Cannot debit another user wallet.';
    END IF;

    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Debit amount must be greater than zero.';
    END IF;

    SELECT * INTO v_wallet
    FROM public.wallets
    WHERE user_id = p_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found for user %', p_user_id;
    END IF;

    IF v_wallet.available_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient available wallet balance. Requested: %, Available: %', p_amount, v_wallet.available_balance;
    END IF;

    v_balance_before := v_wallet.available_balance;
    v_balance_after := v_balance_before - p_amount;

    UPDATE public.wallets
    SET
        available_balance = v_balance_after,
        escrow_balance = CASE WHEN p_lock_in_escrow THEN escrow_balance + p_amount ELSE escrow_balance END,
        total_spent = total_spent + p_amount,
        updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING * INTO v_wallet;

    PERFORM public.create_transaction(
        p_user_id,
        'OUTFLOW',
        p_category,
        p_amount,
        v_balance_before,
        v_balance_after,
        p_reference,
        p_description,
        p_order_id,
        p_escrow_id,
        'SUCCESS'
    );

    RETURN v_wallet;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
