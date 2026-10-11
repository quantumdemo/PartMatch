# PartMatch Security Model & Threat Mitigation

Security is a paramount constraint for PartMatch due to direct financial transactions, escrow holdings, and user KYC identity verification.

---

## 1. Prevention of SQL Injection

### Threat Model
SQL injection occurs when unvalidated user input is concatenated into dynamic SQL queries, enabling malicious database command execution.

### Mitigation Strategies
1. **Parameterized Queries via Supabase Client:**
   - Raw SQL string concatenation is strictly prohibited in application code.
   - All queries use the Supabase JS SDK which parameterizes inputs automatically (e.g., `.eq('user_id', userId)`).
2. **PostgreSQL RPC Stored Procedures:**
   - Database operations for wallet debits/credits are implemented inside PL/pgSQL stored procedures (`credit_wallet`, `debit_wallet`).
   - Stored procedure arguments are strongly typed and parameterized at the database level.
3. **Zod Validation & Sanitization:**
   - Server and client inputs are validated against Zod schemas.
   - Text descriptions and addresses are sanitized via `sanitizeInput()` to strip HTML/script injection tokens.

---

## 2. Row Level Security (RLS) Enforcements

### Threat Model
Unauthorized users or compromised clients attempting to query or mutate other users' financial records, identity documents, or orders.

### Mitigation Strategies
- RLS is explicitly enabled on **all 13 database tables**.
- Default policy pattern: `auth.uid() = user_id`.
- Example RLS Policy for Wallets:
  ```sql
  CREATE POLICY "Users can view own wallet or admins view all" ON public.wallets
      FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
  ```
- Wallet modifications are completely blocked from direct client `UPDATE` statements and are exclusively exposed through `SECURITY DEFINER` RPC stored procedures.

---

## 3. Payment PIN Hash & Lockout Architecture

### Threat Model
Brute-force PIN guessing or plain-text PIN leakage leading to unauthorized wallet funds withdrawal.

### Mitigation Strategies
1. **Bcrypt Password Hashing:**
   - PINs (4 to 6 numeric digits) are never stored in plain text.
   - Hashing uses `bcryptjs` with a cost factor of 10 (`bcrypt.hash(pin, salt)`).
2. **Attempt Counter & Lockout Expiry:**
   - The `payment_pins` table tracks `failed_attempts` and a `locked_until` timestamp.
   - After 3 consecutive failed PIN attempts, the account is locked for 30 minutes WAT.

---

## 4. Atomic Wallet Operations & Double-Spend Protection

### Threat Model
Race conditions resulting from rapid concurrent withdrawal requests attempting to withdraw the same balance twice before database update completion.

### Mitigation Strategies
- Both `credit_wallet` and `debit_wallet` RPC functions employ explicit row locking (`FOR UPDATE`) on the target row in the `wallets` table.
- Concurrent requests for the same `user_id` are forced to execute sequentially, guaranteeing balance sufficiency before debiting.

---

## 5. Paystack Webhook Timing-Safe Verification

### Threat Model
Attacker forging fake payment completion webhooks to credit wallets fraudulently.

### Mitigation Strategies
- All Paystack webhook HTTP POST requests must present a valid `x-paystack-signature` header.
- The server computes `crypto.createHmac('sha512', PAYSTACK_SECRET_KEY)` over the raw request body.
- Comparison between the calculated hash and header signature uses `crypto.timingSafeEqual` to prevent side-channel timing attacks.
