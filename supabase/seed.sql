-- PartMatch Seed SQL
-- Real Database Structure Seed Script
-- Execute via Supabase SQL Editor or CLI

-- 1. Insert Sample Verified Merchant Profiles
INSERT INTO public.profiles (
  user_id,
  role,
  live_verified,
  formatted_address,
  kyc_status
) VALUES
(
  '987e6543-e21b-12d3-a456-426614174001',
  'seller',
  true,
  'Ladipo Auto Spares Market, Mushin, Lagos',
  'APPROVED'
),
(
  '987e6543-e21b-12d3-a456-426614174002',
  'seller',
  true,
  'Aspamda Trade Fair Complex, Ojo, Lagos',
  'APPROVED'
) ON CONFLICT (user_id) DO NOTHING;

-- 2. Insert Sample Auto Parts
INSERT INTO public.products (
  id,
  seller_id,
  title,
  brand,
  part_number,
  category_id,
  description,
  price,
  condition,
  stock_quantity,
  compatibility
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  '987e6543-e21b-12d3-a456-426614174001',
  'Toyota Corolla Ceramic Front Brake Pads',
  'Toyota OEM',
  'OEM-04465-02220',
  'brakes',
  'Genuine OEM Toyota ceramic front brake pad set. Formulated for high heat dissipation under Lagos traffic conditions.',
  18500.00,
  'NEW GENUINE OEM',
  15,
  '{"makes": ["Toyota"], "models": ["Corolla", "Matrix"], "year_start": 2009, "year_end": 2019}'::jsonb
),
(
  '22222222-2222-2222-2222-222222222222',
  '987e6543-e21b-12d3-a456-426614174002',
  'Honda Accord V6 Heavy-Duty Alternator 130A',
  'Denso OEM',
  'DENSO-31100-RKB-004',
  'electrical',
  'Original Denso heavy-duty alternator for Honda Accord 3.5L V6 engine.',
  45000.00,
  'NEW GENUINE OEM',
  4,
  '{"makes": ["Honda"], "models": ["Accord", "Pilot"], "year_start": 2008, "year_end": 2015}'::jsonb
) ON CONFLICT (id) DO NOTHING;
