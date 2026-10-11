"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Truck, Store, Wrench, ArrowRight } from "lucide-react";

const ROLES = [
  {
    id: "buyer",
    code: "R-01",
    title: "Individual Driver",
    description: "Find parts, escrow pay, book mobile mechanics.",
    icon: User,
  },
  {
    id: "buyer_fleet",
    code: "R-02",
    title: "Fleet Vehicle Owner",
    description: "Manage multi-car maintenance and fleet parts orders.",
    icon: Truck,
  },
  {
    id: "seller",
    code: "R-03",
    title: "Parts Merchant / Seller",
    description: "List spare parts, fulfill orders, get direct payouts.",
    icon: Store,
  },
  {
    id: "mechanic",
    code: "R-04",
    title: "Mobile Mechanic",
    description: "Accept nearby jobs, complete checklists, earn fees.",
    icon: Wrench,
  },
];

export default function RoleSelectPage() {
  const [selectedRole, setSelectedRole] = useState<string>("buyer");
  const router = useRouter();

  const handleContinue = () => {
    if (!selectedRole) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("partmatch_selected_role", selectedRole);
      document.cookie = `partmatch_user_role=${selectedRole}; path=/; max-age=86400; SameSite=Lax`;
    }
    router.push("/onboarding/auth");
  };

  return (
    <main className="min-h-screen bg-[#FFFBF5] text-[#121212] font-sans flex flex-col justify-between py-6 px-4">
      <div className="max-w-[440px] w-full mx-auto space-y-6 flex-1 flex flex-col justify-center">

        {/* Top Progress Stepper */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
          </div>
          <p className="text-xs font-medium text-[#8A8A8A]">Step 1/5</p>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#121212]">
            Choose your role
          </h1>
          <p className="text-sm text-[#8A8A8A]">
            How will you use PartMatch?
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-4 rounded-[16px] transition-all duration-150 cursor-pointer min-h-[110px] flex flex-col justify-between active:scale-[0.98] ${
                  isSelected
                    ? "bg-[#FFFFFF] border-2 border-[#FF4D1A] shadow-md"
                    : "bg-[#FFFFFF] border border-[#EAEAEA] hover:border-slate-300 shadow-sm"
                }`}
              >
                {/* Top Row: Icon + Code Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-[#FF4D1A] text-white"
                        : "bg-[#FFFBF5] text-[#121212] border border-[#EAEAEA]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-[#8A8A8A] bg-[#F8FAFC] px-2 py-0.5 rounded-full border border-[#EAEAEA]">
                    {role.code}
                  </span>
                </div>

                {/* Text Details */}
                <div className="mt-2 space-y-0.5">
                  <h3 className="font-bold text-sm text-[#121212]">{role.title}</h3>
                  <p className="text-xs text-[#8A8A8A] line-clamp-2 leading-tight">
                    {role.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom OPay-Style CTA Button Container */}
      <div className="sticky bottom-0 left-0 right-0 pt-4 pb-2 bg-[#FFFBF5]/90 backdrop-blur-md max-w-[440px] w-full mx-auto">
        <button
          type="button"
          disabled={!selectedRole}
          onClick={handleContinue}
          className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] disabled:bg-[#EAEAEA] disabled:text-[#8A8A8A] active:scale-[0.97] transition-transform duration-150 text-white font-bold text-sm rounded-[12px] shadow-sm flex items-center justify-center gap-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
}
