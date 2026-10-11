import { addMinutes, addHours } from "date-fns";

export const NIGERIA_TIMEZONE = "Africa/Lagos";

/**
 * Formats any UTC Date/string/number into Nigerian WAT format:
 * Example: "10 Oct 2026, 2:30 PM WAT"
 */
export function formatWAT(dateInput: Date | string | number | null | undefined): string {
  if (!dateInput) return "N/A";
  try {
    const date = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return "Invalid Date";

    // Format using Intl.DateTimeFormat in Africa/Lagos timezone
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: NIGERIA_TIMEZONE,
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const parts = formatter.formatToParts(date);
    let day = "", month = "", year = "", hour = "", minute = "", dayPeriod = "";

    for (const part of parts) {
      if (part.type === "day") day = part.value;
      if (part.type === "month") month = part.value;
      if (part.type === "year") year = part.value;
      if (part.type === "hour") hour = part.value;
      if (part.type === "minute") minute = part.value;
      if (part.type === "dayPeriod") dayPeriod = part.value.toUpperCase();
    }

    return `${day} ${month} ${year}, ${hour}:${minute} ${dayPeriod} WAT`;
  } catch (err) {
    console.error("Error formatting WAT date:", err);
    return "N/A";
  }
}

/**
 * Returns current timestamp in UTC
 */
export function getCurrentUTC(): Date {
  return new Date();
}

/**
 * Calculates OTP Expiry timestamp (10 minutes WAT)
 */
export function getOTPExpiryWAT(now: Date = new Date()): Date {
  return addMinutes(now, 10);
}

/**
 * Calculates Escrow Expiry timestamp (72 hours WAT)
 */
export function getEscrowExpiryWAT(now: Date = new Date()): Date {
  return addHours(now, 72);
}

/**
 * Calculates PIN Lockout timestamp (30 minutes WAT)
 */
export function getPinLockoutWAT(now: Date = new Date()): Date {
  return addMinutes(now, 30);
}

/**
 * Checks if a given timestamp has expired against the current time
 */
export function isExpired(expiryDate: Date | string | number | null | undefined): boolean {
  if (!expiryDate) return true;
  const date = typeof expiryDate === "string" || typeof expiryDate === "number" ? new Date(expiryDate) : expiryDate;
  return new Date().getTime() > date.getTime();
}
