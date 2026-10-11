# PartMatch Environment Setup Guide

This guide explains how to set up environment variables for local development and Vercel deployment.

---

## 1. Local Environment Setup

1. Copy `.env.example` to create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and populate the required API keys.

---

## 2. API Key Acquisition Guide

### A. Supabase URL and Keys
- Visit [Supabase Dashboard](https://supabase.com/dashboard) and create/select your project.
- Navigate to **Project Settings -> API**.
- Copy `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`.
- Copy `anon public` -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Copy `service_role secret` -> `SUPABASE_SERVICE_ROLE_KEY`.

### B. Paystack Keys
- Visit [Paystack Dashboard](https://dashboard.paystack.com) and go to **Settings -> API Keys & Webhooks**.
- Copy `Public Key` -> `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`.
- Copy `Secret Key` -> `PAYSTACK_SECRET_KEY`.

### C. Resend Email API Key
- Visit [Resend Dashboard](https://resend.com) and create an API key under **API Keys**.
- Copy key -> `RESEND_API_KEY`.

### D. Google OAuth Credentials
- Visit [Google Cloud Console](https://console.cloud.google.com) and create a project.
- Go to **APIs & Services -> Credentials** and create an OAuth 2.0 Client ID.
- Set Authorized Redirect URI to `https://<your-supabase-project-id>.supabase.co/auth/v1/callback`.
- Copy Client ID and Secret to `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

### E. Mapbox Access Token
- Visit [Mapbox Account](https://account.mapbox.com) and copy your Default Public Token -> `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`.

---

## 3. Database Migration Execution

Apply the SQL migration file located at `supabase/migrations/20261011000000_partmatch_stage1_schema.sql` via:
- **Supabase Dashboard SQL Editor**: Copy and run the entire SQL file contents.
- **Supabase CLI**:
  ```bash
  supabase db push
  ```
