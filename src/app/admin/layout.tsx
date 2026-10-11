"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  ShieldAlert,
  AlertOctagon,
  BarChart3,
  Settings,
  Menu,
  X,
  ShieldCheck,
  HelpCircle,
  Bell,
} from "lucide-react";

const ADMIN_NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users & KYC", icon: Users },
  { href: "/admin/orders", label: "All Orders", icon: Package },
  { href: "/admin/escrow", label: "Escrow Control", icon: ShieldAlert },
  { href: "/admin/disputes", label: "Disputes", icon: AlertOctagon },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Platform Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#121212] font-sans flex flex-col md:flex-row">
      {/* Desktop Sidebar (240px Fixed) */}
      <aside className="hidden md:flex flex-col w-60 bg-[#121212] text-white min-h-screen p-4 border-r border-neutral-800 shrink-0">
        <div className="flex items-center gap-2 px-2 py-3 border-b border-neutral-800 mb-4">
          <div className="w-8 h-8 bg-[#FF4D1A] rounded-xl flex items-center justify-center font-bold text-sm text-white">
            PM
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">PartMatch Admin</h2>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> R-05 Superadmin
            </span>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-[#FF4D1A] text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#EAEAEA] h-16 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-[#EAEAEA]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-sm font-bold text-[#121212]">Admin Management System</h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-[#FFFBF5] border border-[#EAEAEA]">
              <HelpCircle className="w-4 h-4 text-[#8A8A8A]" />
            </button>
            <button className="p-2 rounded-xl bg-[#FFFBF5] border border-[#EAEAEA] relative">
              <Bell className="w-4 h-4 text-[#8A8A8A]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF4D1A] rounded-full" />
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#121212] text-white p-4 space-y-1 border-b border-neutral-800">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-xs font-bold ${
                    isActive ? "bg-[#FF4D1A] text-white" : "text-neutral-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
