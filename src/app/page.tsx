import React from "react";
import { ShieldCheck, Database, Lock, Clock, Wrench, Wallet, CheckCircle2 } from "lucide-react";
import { formatWAT } from "@/lib/timezone";

export default function HomePage() {
  const currentTimeWAT = formatWAT(new Date());

  return (
    <main className="min-h-screen bg-[#FFFBF5] text-[#0F172A] p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header Section */}
        <header className="border-b border-slate-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FF4D1A]/10 text-[#FF4D1A] px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <ShieldCheck className="w-4 h-4" /> Stage 1: PartMatch Foundation
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              PartMatch Core Architecture
            </h1>
            <p className="text-[#64748B] text-sm mt-1">
              Automotive Commerce & Mobile Mechanic Marketplace for Africa (Nigeria Focus)
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-right text-xs text-[#64748B]">
            <div className="flex items-center justify-end gap-1 font-medium text-[#0F172A]">
              <Clock className="w-3.5 h-3.5 text-[#FF4D1A]" /> {currentTimeWAT}
            </div>
            <span>System Timezone: Africa/Lagos (WAT)</span>
          </div>
        </header>

        {/* System Architecture Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-sm font-semibold text-[#64748B]">
              <span>Wallet System</span>
              <Wallet className="w-5 h-5 text-[#FF4D1A]" />
            </div>
            <div className="text-3xl font-extrabold text-[#0F172A]">
              ₦0.00 <span className="text-xs font-normal text-[#64748B]">NGN</span>
            </div>
            <p className="text-xs text-[#64748B]">
              Atomic RPC Wallet Operations (debit/credit with row locking)
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-sm font-semibold text-[#64748B]">
              <span>Database Integrity</span>
              <Database className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-700">
              Fresh DB
            </div>
            <p className="text-xs text-[#64748B]">
              Zero demo data / placeholder policies strictly enforced
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-sm font-semibold text-[#64748B]">
              <span>Security Engine</span>
              <Lock className="w-5 h-5 text-[#FF4D1A]" />
            </div>
            <div className="text-3xl font-extrabold text-[#0F172A]">
              RLS + RPC
            </div>
            <p className="text-xs text-[#64748B]">
              13 Tables protected with strict RLS policies & bcrypt PINs
            </p>
          </div>
        </div>

        {/* Platform Core Verification Checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#FF4D1A]" />
            Stage 1 Specification Verification Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-semibold text-[#0F172A]">Supabase Schema & RLS</div>
              <p className="text-[#64748B] text-xs">
                13 relational tables configured with strict RLS policies (<code className="bg-slate-200 px-1 rounded">auth.uid() = user_id</code>) & column comments.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-semibold text-[#0F172A]">Atomic RPC Ledger</div>
              <p className="text-[#64748B] text-xs">
                Immutable <code className="bg-slate-200 px-1 rounded">transactions</code> ledger with <code className="bg-slate-200 px-1 rounded">credit_wallet</code> & <code className="bg-slate-200 px-1 rounded">debit_wallet</code> row locking.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-semibold text-[#0F172A]">Security Protocols</div>
              <p className="text-[#64748B] text-xs">
                Bcrypt PIN hashing, timing-safe Paystack webhook verification, Zod input sanitization, and strict CORS/CSP.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-semibold text-[#0F172A]">Timezone & Currency Standard</div>
              <p className="text-[#64748B] text-xs">
                Timestamps stored in UTC & rendered in <code className="bg-slate-200 px-1 rounded">Africa/Lagos (WAT)</code>. Currency locked exclusively to <code className="bg-slate-200 px-1 rounded">₦ (NGN)</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Expo Service Integration Note */}
        <div className="bg-[#FF4D1A]/5 border border-[#FF4D1A]/20 rounded-2xl p-6 text-xs text-[#0F172A] flex items-start gap-3">
          <Wrench className="w-5 h-5 text-[#FF4D1A] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Expo Mobile App Layer Integration Ready:</span>
            <p className="text-[#64748B] mt-1">
              All backend business logic, Zod validation schemas, RPC callers, and security functions are located in reusable TypeScript modules in <code className="bg-white border px-1 rounded">@/services</code>, <code className="bg-white border px-1 rounded">@/hooks</code>, and <code className="bg-white border px-1 rounded">@/lib</code> for direct compatibility with future React Native / Expo mobile applications for R-01 (Driver), R-02 (Fleet), R-03 (Seller), and R-04 (Mechanic).
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
