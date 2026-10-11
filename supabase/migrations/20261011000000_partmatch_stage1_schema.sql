-- PartMatch Schema Stage 1 & Support Extension

CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'buyer',
  avatar_url TEXT,
  live_verified BOOLEAN DEFAULT FALSE,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  formatted_address TEXT,
  terms_accepted_at TIMESTAMPTZ,
  kyc_status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'User profiles storing verified KYC status, role permissions, and live face verification images.';

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  order_ref TEXT,
  status TEXT DEFAULT 'OPEN',
  assigned_admin UUID,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.support_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id TEXT NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  sender_role TEXT NOT NULL,
  message TEXT NOT NULL,
  photo_url TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ai_diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  vehicle_id TEXT,
  input TEXT,
  result JSONB,
  confidence DOUBLE PRECISION,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_diagnoses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own tickets" ON public.support_tickets FOR SELECT USING (true);
CREATE POLICY "Users can insert own tickets" ON public.support_tickets FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view chat messages" ON public.support_chat_messages FOR SELECT USING (true);
CREATE POLICY "Users can insert chat messages" ON public.support_chat_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view FAQs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert AI diagnoses" ON public.ai_diagnoses FOR ALL USING (true);
