import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const MOBILE_ROUTES = [
  "/",
  "/onboarding",
  "/onboarding/auth",
  "/onboarding/kyc",
  "/onboarding/live-verify",
  "/onboarding/pin",
  "/wallet/bank-accounts",
  "/dashboard",
  "/garage",
  "/garage/add",
  "/diagnose",
  "/diagnose/scanning",
  "/diagnose/result",
  "/diagnose/fitment",
  "/diagnose/search",
  "/marketplace/part-001",
  "/seller/seller-001",
  "/cart",
  "/checkout/escrow",
  "/checkout/pay",
  "/orders",
  "/orders/part-001",
  "/orders/tracking/part-001",
  "/delivery/confirm/part-001",
  "/wallet",
  "/me",
  "/me/request-change",
  "/support",
  "/support/chat/new",
  "/support/chat/TCK-88120",
  "/mechanic/onboarding",
  "/mechanic/dashboard",
  "/mechanic/jobs",
  "/mechanic/jobs/job-101",
  "/mechanic/job/active/job-101",
  "/mechanic/job/complete/job-101",
  "/mechanic/wallet",
  "/mechanic/me",
  "/seller/onboarding",
  "/seller/dashboard",
  "/seller/inventory",
  "/seller/inventory/add",
  "/seller/inventory/part-001",
  "/seller/orders",
  "/seller/orders/part-001",
  "/seller/wallet",
  "/seller/me",
];

const ADMIN_ROUTES = [
  "/admin/dashboard",
  "/admin/users",
  "/admin/profile-requests",
  "/admin/inventory-review",
  "/admin/orders",
  "/admin/escrow",
  "/admin/disputes",
  "/admin/support",
  "/admin/analytics",
  "/admin/settings",
];

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function generateSnapshots() {
  console.log("=== Generating PartMatch Playwright Snapshot Images ===");

  const mobileDir = path.join(process.cwd(), "snapshots", "mobile");
  const adminDir = path.join(process.cwd(), "snapshots", "admin");

  fs.mkdirSync(mobileDir, { recursive: true });
  fs.mkdirSync(adminDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  // 1. Mobile Route Snapshots (Viewport 440x956)
  console.log("\nCapturing Mobile View Snapshots (440x956)...");
  const mobileContext = await browser.newContext({
    viewport: { width: 440, height: 956 },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
  });
  const mobilePage = await mobileContext.newPage();

  for (const route of MOBILE_ROUTES) {
    const filename = route === "/" ? "home.png" : `${route.replace(/^\//, "").replace(/\//g, "-")}.png`;
    const targetPath = path.join(mobileDir, filename);

    try {
      await mobilePage.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 15000 });
      await mobilePage.waitForTimeout(1000);
      await mobilePage.screenshot({ path: targetPath, fullPage: true });
      console.log(` ✓ Saved Mobile: ${filename}`);
    } catch (e) {
      console.warn(` ⚠ Failed Mobile Route ${route}:`, e.message);
    }
  }

  // 2. Admin Route Snapshots (Viewport 1440x900)
  console.log("\nCapturing Admin Desktop Snapshots (1440x900)...");
  const adminContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const adminPage = await adminContext.newPage();

  for (const route of ADMIN_ROUTES) {
    const filename = `${route.replace(/^\//, "").replace(/\//g, "-")}.png`;
    const targetPath = path.join(adminDir, filename);

    try {
      await adminPage.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 15000 });
      await adminPage.waitForTimeout(1000);
      await adminPage.screenshot({ path: targetPath, fullPage: true });
      console.log(` ✓ Saved Admin Desktop: ${filename}`);
    } catch (e) {
      console.warn(` ⚠ Failed Admin Route ${route}:`, e.message);
    }
  }

  await browser.close();
  console.log("\n=== Snapshot Generation Complete ===");
}

generateSnapshots().catch((err) => {
  console.error("Snapshot error:", err);
  process.exit(1);
});
