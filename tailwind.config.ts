import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFBF5",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#FF4D1A",
          hover: "#E03E0F",
        },
        slate: {
          dark: "#0F172A",
          muted: "#64748B",
          border: "#E2E8F0",
          bg: "#F8FAFC",
        },
        status: {
          success: {
            text: "#15803D",
            bg: "#DCFCE7",
          },
          warning: {
            text: "#B45309",
            bg: "#FEF3C7",
          },
          error: {
            text: "#B91C1C",
            bg: "#FEE2E2",
          },
        },
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
