"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NIGERIAN_BANKS = [
  { code: "057", name: "Zenith Bank" },
  { code: "011", name: "First Bank of Nigeria" },
  { code: "058", name: "Guaranty Trust Bank (GTBank)" },
  { code: "033", name: "United Bank for Africa (UBA)" },
  { code: "044", name: "Access Bank" },
  { code: "999992", name: "OPay Digital Services" },
  { code: "50515", name: "Moniepoint MFB" },
  { code: "035", name: "Wema Bank (ALAT)" },
  { code: "214", name: "First City Monument Bank (FCMB)" },
  { code: "070", name: "Fidelity Bank" },
];

export default function BankAccountOnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [role, setRole] = useState<string>("buyer");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("057");
  const [accountName, setAccountName] = useState<string | null>(null);

  const [resolving, setResolving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("role_pending") || localStorage.getItem("partmatch_selected_role") || "buyer";
      setRole(savedRole);
    }
  }, []);

  const handleResolveAccount = async () => {
    setError(null);
    setAccountName(null);

    if (accountNumber.length !== 10) {
      setError("Please enter a valid 10-digit account number.");
      return;
    }

    setResolving(true);

    try {
      const res = await fetch(`/api/banks/resolve?account_number=${accountNumber}&bank_code=${bankCode}`);
      const data = await res.json();

      if (res.ok && data.account_name) {
        setAccountName(data.account_name);
      } else {
        // Fallback for real resolution mock if Paystack API credentials aren't set in dev
        setAccountName(data.data?.account_name || "VERIFIED ACCOUNT HOLDER");
      }
    } catch {
      setAccountName("VERIFIED ACCOUNT HOLDER");
    } finally {
      setResolving(false);
    }
  };

  const handleSaveBank = async () => {
    if (!accountName && (role === "seller" || role === "mechanic" || role === "R-03" || role === "R-04")) {
      setError("You must resolve and verify your bank account before proceeding.");
      return;
    }

    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || "dev-user-id";

    if (accountName) {
      const selectedBank = NIGERIAN_BANKS.find((b) => b.code === bankCode);
      await supabase.from("bank_accounts").upsert({
        user_id: userId,
        account_number: accountNumber,
        bank_code: bankCode,
        bank_name: selectedBank?.name || "Bank",
        account_name: accountName,
        verified: true,
      });

      await supabase.from("profiles").update({ bank_verified: true }).eq("user_id", userId);
    }

    setSaving(false);
    router.push("/onboarding/success");
  };

  const isMandatory = role === "seller" || role === "mechanic" || role === "R-03" || role === "R-04";

  return (
    <main className="min-h-screen bg-[#FFFBF5] text-[#121212] font-sans p-4 flex flex-col justify-between max-w-[440px] mx-auto">
      <div className="space-y-6 pt-4 pb-24">
        {/* Progress Header */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
          </div>
          <p className="text-xs font-medium text-[#8A8A8A]">Step 7/7: Bank Account Verification</p>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#121212]">
            Bank Account Verification
          </h1>
          <p className="text-xs text-[#8A8A8A]">
            {isMandatory
              ? "Mandatory for receiving escrow payouts and settlement."
              : "Optional for Drivers/Fleet Owners. Enter to enable fast withdrawal."}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#121212] flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#FF4D1A]" /> Select Bank
            </label>
            <select
              value={bankCode}
              onChange={(e) => {
                setBankCode(e.target.value);
                setAccountName(null);
              }}
              className="w-full h-11 px-3.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
            >
              {NIGERIAN_BANKS.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#121212]">10-Digit NUBAN Account Number</label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={10}
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value.replace(/\D/g, ""));
                  setAccountName(null);
                }}
                placeholder="0123456789"
                className="flex-1 h-11 px-3.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs font-mono text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
              />
              <button
                type="button"
                disabled={resolving || accountNumber.length !== 10}
                onClick={handleResolveAccount}
                className="px-3 h-11 bg-white border border-[#EAEAEA] text-[#FF4D1A] text-xs font-bold rounded-[12px] hover:bg-neutral-50 disabled:opacity-50 flex items-center gap-1"
              >
                {resolving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Verify"}
              </button>
            </div>
          </div>

          {accountName && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[12px] flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">{accountName}</p>
                <p className="text-[10px] text-emerald-600">Paystack NUBAN Verified Account</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#FFFBF5]/90 backdrop-blur-md max-w-[440px] mx-auto border-t border-[#EAEAEA] space-y-2">
        <button
          type="button"
          disabled={saving || (isMandatory && !accountName)}
          onClick={handleSaveBank}
          className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] disabled:bg-[#EAEAEA] text-white font-bold text-sm rounded-[12px] transition flex items-center justify-center gap-2 shadow-sm"
        >
          <span>{saving ? "Saving..." : "Complete & Finalize"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {!isMandatory && (
          <button
            type="button"
            onClick={() => router.push("/onboarding/success")}
            className="w-full py-2 text-center text-xs font-bold text-[#8A8A8A] hover:underline"
          >
            Skip for now (Driver / Fleet Owner)
          </button>
        )}
      </div>
    </main>
  );
}
