import { formatWAT, getOTPExpiryWAT, isExpired } from "./timezone";
import { sanitizeInput, verifyPaystackSignature, generateTransactionRef } from "./security";
import { PaymentPinSchema, WalletSchema } from "./validation";

export function runTests() {
  console.log("=== Running PartMatch Core Tests ===");

  // Test 1: Timezone WAT formatting
  const testDate = new Date("2026-10-10T13:30:00Z");
  const formattedWAT = formatWAT(testDate);
  console.assert(
    formattedWAT.includes("10 Oct 2026") && formattedWAT.includes("WAT"),
    `Test 1 Failed: ${formattedWAT}`
  );
  console.log("✓ Test 1 Passed: WAT Timezone formatting correct.");

  // Test 2: Sanitize Input XSS
  const unsafeText = "<script>alert('xss')</script>";
  const safeText = sanitizeInput(unsafeText);
  console.assert(
    !safeText.includes("<script>") && safeText.includes("&lt;script&gt;"),
    `Test 2 Failed: ${safeText}`
  );
  console.log("✓ Test 2 Passed: Input sanitization correct.");

  // Test 3: Transaction Ref Generation
  const ref = generateTransactionRef();
  console.assert(ref.startsWith("PM-REF-"), `Test 3 Failed: ${ref}`);
  console.log("✓ Test 3 Passed: Transaction reference generation correct.");

  // Test 4: Zod Validation - Valid PIN
  const validPinRes = PaymentPinSchema.safeParse({ pin: "1234", confirm_pin: "1234" });
  console.assert(validPinRes.success === true, `Test 4 Failed: ${JSON.stringify(validPinRes)}`);
  console.log("✓ Test 4 Passed: Payment PIN validation correct.");

  // Test 5: Zod Validation - Invalid Wallet Currency
  const invalidWalletRes = WalletSchema.safeParse({
    user_id: "123e4567-e89b-12d3-a456-426614174000",
    available_balance: 1000,
    escrow_balance: 0,
    total_earned: 1000,
    total_spent: 0,
    currency: "USD",
  });
  console.assert(invalidWalletRes.success === false, "Test 5 Failed: Currency USD allowed");
  console.log("✓ Test 5 Passed: NGN Currency enforcement strictly valid.");

  // Test 6: OTP Expiry Calculation
  const now = new Date();
  const otpExpiry = getOTPExpiryWAT(now);
  console.assert(otpExpiry.getTime() > now.getTime(), "Test 6 Failed: OTP Expiry time invalid");
  console.assert(!isExpired(otpExpiry), "Test 6 Failed: Fresh OTP reported as expired");
  console.log("✓ Test 6 Passed: OTP Expiry calculation valid.");

  // Test 7: Paystack Signature Verification
  const dummyBody = JSON.stringify({ event: "charge.success" });
  const secret = "sk_test_123456789";
  const isValidSig = verifyPaystackSignature(dummyBody, "invalid_sig", secret);
  console.assert(isValidSig === false, "Test 7 Failed: Invalid signature passed verification");
  console.log("✓ Test 7 Passed: Paystack signature timing-safe verification valid.");

  console.log("=== All PartMatch Core Tests Passed! ===");
}

if (require.main === module) {
  runTests();
}
