"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Truck, Store, Wrench, ArrowRight, ShieldCheck } from "lucide-react";

const ROLES = [
  {
    id: "buyer",
    code: "R-01",
    title: "Individual Driver",
    description: "Search compatible spare parts, place protected orders, and book mobile mechanics.",
    icon: User,
  },
  {
    id: "buyer_fleet",
    code: "R-02",
    title: "Fleet Vehicle Owner",
    description: "Manage multiple commercial vehicles, recurring maintenance, and parts orders.",
    icon: Truck,
  },
  {
    id: "seller",
    code: "R-03",
    title: "Parts Merchant / Seller",
    description: "List verified auto spare parts inventory, manage orders, and receive direct NGN payouts.",
    icon: Store,
  },
  {
    id: "mechanic",
    code: "R-04",
    title: "Mobile Mechanic",
    description: "Receive nearby installation jobs, complete work checklists, and earn instant service fees.",
    icon: Wrench,
  },
];

export default function RoleSelectPage() {
  const [selectedRole, setSelectedRole] = useState<string>("buyer");
  const router = useRouter();

  const handleContinue = () => {
    // Store selected role in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("partmatch_selected_role", selectedRole);
    }
    router.push("/onboarding/auth");
  };

  return (
    <main className="min-h-screen bg-[#FFFBF5] text-[#0F172A] p-6 md:p-12 font-sans flex items-center justify-center">
      <div className="max-w-xl w-full space-y-6">
        <header className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF4D1A] bg-[#FF4D1A]/10 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" /> Step 1 of 5: Role Selection
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Select Your PartMatch Account Role
          </h1>
          <p className="text-xs text-[#64748B]">
            Choose how you will be using the PartMatch automotive marketplace in Nigeria.
          </p>
        </header>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? "bg-white border-[#FF4D1A] ring-2 ring-[#FF4D1A]/20 shadow-md"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? "bg-[#FF4D1A] text-white" : "bg-slate-100 text-[#0F172A]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-full">
                    {role.code}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-[#0F172A]">{role.title}</h3>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{role.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="w-full py-3.5 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-sm font-extrabold rounded-xl transition shadow-sm flex items-center justify-center gap-2"
        >
          Continue to Account Registration <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
}
