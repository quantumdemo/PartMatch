"use client";

import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center bg-[#FFFBF5] dark:bg-neutral-900 border border-[#EAEAEA] dark:border-neutral-800 p-1 rounded-[12px] gap-1">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`flex-1 py-1.5 px-2 rounded-[8px] text-xs font-bold flex items-center justify-center gap-1 transition ${
          theme === "light"
            ? "bg-white dark:bg-neutral-800 text-[#FF4D1A] shadow-sm"
            : "text-[#8A8A8A] hover:text-[#121212] dark:hover:text-white"
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
        <span>Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`flex-1 py-1.5 px-2 rounded-[8px] text-xs font-bold flex items-center justify-center gap-1 transition ${
          theme === "dark"
            ? "bg-white dark:bg-neutral-800 text-[#FF4D1A] shadow-sm"
            : "text-[#8A8A8A] hover:text-[#121212] dark:hover:text-white"
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
        <span>Dark</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("system")}
        className={`flex-1 py-1.5 px-2 rounded-[8px] text-xs font-bold flex items-center justify-center gap-1 transition ${
          theme === "system"
            ? "bg-white dark:bg-neutral-800 text-[#FF4D1A] shadow-sm"
            : "text-[#8A8A8A] hover:text-[#121212] dark:hover:text-white"
        }`}
      >
        <Monitor className="w-3.5 h-3.5" />
        <span>System</span>
      </button>
    </div>
  );
}
