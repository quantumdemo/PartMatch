"use client";

import React, { useState, useEffect } from "react";
import { Building2, CheckCircle2, AlertCircle, Plus, ShieldCheck } from "lucide-react";
import { InfoTooltip } from "@/components/InfoTooltip";
import { BankService, BankItem } from "@/lib/services/bankService";
import { createClient } from "@/lib/supabase/client";

interface BankAccountRecord {
  id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  is_verified: boolean;
  is_default: boolean;
}

export default function BankAccountsPage() {
  const [banks, setBanks] = useState<BankItem[]>([]);
  const [selectedBankCode, setSelectedBankCode] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [resolvedName, setResolvedName] = useState<string | null>(null);

  const [accounts, setAccounts] = useState<BankAccountRecord[]>([]);
  const [resolving, setResolving] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load Banks & Saved Bank Accounts
  useEffect(() => {
    async function init() {
      const bankList = await BankService.fetchPaystackBanks();
      setBanks(bankList);
      if (bankList.length > 0) setSelectedBankCode(bankList[0].code);

      // Load saved bank accounts
      const supabase = createClient();
      const { data } = await supabase.from("bank_accounts").select("*");
      if (data) {
        setAccounts(data);
      }
    }
    init();
  }, []);

  const handleResolveAccount = async () => {
    if (accountNumber.length !== 10) {
      setError("Please enter a 10-digit NUBAN account number.");
      return;
    }

    try {
      setResolving(true);
      setError(null);
      setResolvedName(null);

      const res = await BankService.resolveAccount(accountNumber, selectedBankCode);
      setResolvedName(res.account_name);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Account resolution failed.";
      setError(msg);
    } finally {
      setResolving(false);
    }
  };

  const handleAddAccount = async () => {
    if (!resolvedName) return;

    try {
      setSaving(true);
      setError(null);
      const selectedBank = banks.find((b) => b.code === selectedBankCode);

      // Fetch active auth user or dummy dev id
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id || "123e4567-e89b-12d3-a456-426614174000";

      await BankService.addVerifiedBankAccount({
        userId,
        bankCode: selectedBankCode,
        bankName: selectedBank?.name || "Nigerian Bank",
        accountNumber,
        accountName: resolvedName,
      });

      setSuccessMsg("Bank account successfully verified and saved for withdrawals!");
      setAccountNumber("");
      setResolvedName(null);

      // Reload accounts
      const { data } = await supabase.from("bank_accounts").select("*");
      if (data) setAccounts(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add bank account.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFBF5] text-[#0F172A] p-6 md:p-12 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        <header className="border-b border-slate-200 pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF4D1A] bg-[#FF4D1A]/10 px-3 py-1 rounded-full mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Payout Destination
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Payment Accounts & Payouts</h1>
          <p className="text-xs text-[#64748B]">
            Add a verified Nigerian bank account matching your legal name for instant wallet withdrawals.
          </p>
        </header>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Add Bank Account Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#FF4D1A]" /> Add New Bank Account <InfoTooltip id="bank_account" />
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Select Bank</label>
            <select
              value={selectedBankCode}
              onChange={(e) => setSelectedBankCode(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
            >
              {banks.map((b) => (
                <option key={b.id || b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">NUBAN Account Number</label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={10}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 10-digit account number"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
              />
              <button
                type="button"
                onClick={handleResolveAccount}
                disabled={resolving || accountNumber.length !== 10}
                className="px-4 py-2.5 bg-[#FF4D1A] hover:bg-[#E03E0F] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition"
              >
                {resolving ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>

          {/* Resolved Name Confirmation Banner */}
          {resolvedName && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-900">
              <div className="font-semibold flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Account Name Resolved
              </div>
              <div className="text-base font-extrabold text-[#0F172A]">{resolvedName}</div>
              <p className="text-[11px] text-emerald-700">
                Verified via Paystack NUBAN Directory. Click save to set as default payout bank.
              </p>
              <button
                type="button"
                disabled={saving}
                onClick={handleAddAccount}
                className="w-full mt-2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Save Verified Bank Account
              </button>
            </div>
          )}
        </div>

        {/* Existing Verified Bank Accounts List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
            Your Verified Bank Accounts
          </h3>

          {accounts.length === 0 ? (
            <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
              No verified bank accounts added yet. Add one above to enable withdrawals.
            </div>
          ) : (
            accounts.map((acc) => (
              <div
                key={acc.id}
                className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-[#0F172A] flex items-center gap-1.5">
                    {acc.bank_name}
                    {acc.is_verified && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-slate-600">{acc.account_number}</div>
                  <div className="text-xs text-[#64748B] font-medium">{acc.account_name}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
