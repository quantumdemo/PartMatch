"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Car, Package, Wallet, User, Wrench } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const isMechanicRoute = pathname.startsWith("/mechanic");

  const CUSTOMER_NAV = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/garage", label: "Garage", icon: Car },
    { href: "/orders", label: "Orders", icon: Package },
    { href: "/wallet", label: "Wallet", icon: Wallet },
    { href: "/me", label: "Me", icon: User },
  ];

  const MECHANIC_NAV = [
    { href: "/mechanic/dashboard", label: "Home", icon: Home },
    { href: "/mechanic/jobs", label: "Jobs", icon: Wrench },
    { href: "/mechanic/wallet", label: "Wallet", icon: Wallet },
    { href: "/mechanic/me", label: "Me", icon: User },
  ];

  const NAV_ITEMS = isMechanicRoute ? MECHANIC_NAV : CUSTOMER_NAV;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t border-[#EAEAEA] max-w-[440px] mx-auto h-16 flex items-center justify-around px-2 shadow-lg">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center space-y-1 rounded-xl transition-all duration-150 active:scale-[0.95] ${
              isActive ? "text-[#FF4D1A] font-bold" : "text-[#8A8A8A] hover:text-[#121212]"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
