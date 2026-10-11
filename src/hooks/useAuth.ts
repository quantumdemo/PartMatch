import { useState, useEffect, useCallback } from "react";
import { AuthService } from "@/lib/services/authService";

export function useAuth() {
  const [countdown, setCountdown] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Countdown timer interval for OTP resend (60 seconds)
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const sendOTP = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await AuthService.sendEmailOTP(email);
      setCountdown(60); // Start 60-second timer
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send OTP.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOTP = useCallback(async (email: string, token: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await AuthService.verifyEmailOTP(email, token);
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid or expired OTP token.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    countdown,
    canResend: countdown === 0,
    loading,
    error,
    sendOTP,
    verifyOTP,
    signInWithGoogle: AuthService.signInWithGoogle,
    signInWithApple: AuthService.signInWithApple,
  };
}
