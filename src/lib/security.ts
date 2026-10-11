import crypto from "crypto";
import bcrypt from "bcryptjs";

/**
 * Sanitizes input text to prevent XSS attacks.
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Verifies Paystack Webhook Signature using crypto.timingSafeEqual
 * Prevents timing attacks when verifying payment notifications.
 */
export function verifyPaystackSignature(
  rawBody: string | Buffer,
  signatureFromHeader: string | null | undefined,
  paystackSecretKey: string
): boolean {
  if (!signatureFromHeader || !paystackSecretKey || !rawBody) {
    return false;
  }

  try {
    const computedHash = crypto
      .createHmac("sha512", paystackSecretKey)
      .update(rawBody)
      .digest("hex");

    const computedBuffer = Buffer.from(computedHash, "utf8");
    const headerBuffer = Buffer.from(signatureFromHeader, "utf8");

    if (computedBuffer.length !== headerBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(computedBuffer, headerBuffer);
  } catch (error) {
    console.error("Paystack signature verification error:", error);
    return false;
  }
}

/**
 * Hashes a payment PIN using bcrypt (10 rounds salt).
 */
export async function hashPaymentPin(pin: string): Promise<string> {
  if (!/^\d{4,6}$/.test(pin)) {
    throw new Error("Payment PIN must be 4 to 6 numeric digits.");
  }
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pin, salt);
}

/**
 * Compares a raw PIN against a stored bcrypt hash.
 */
export async function comparePaymentPin(pin: string, storedHash: string): Promise<boolean> {
  if (!pin || !storedHash) return false;
  return bcrypt.compare(pin, storedHash);
}

/**
 * Generates a unique transaction reference in PM-REF-XXXXXX format.
 */
export function generateTransactionRef(prefix: string = "PM-REF"): string {
  const randomHex = crypto.randomBytes(4).toString("hex").toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}-${timestamp}-${randomHex}`;
}
