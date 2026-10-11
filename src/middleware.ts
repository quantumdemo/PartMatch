import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Driver/Fleet protected routes
  const driverRoutes = [
    "/garage",
    "/diagnose",
    "/marketplace",
    "/cart",
    "/checkout",
    "/orders",
  ];

  const isDriverRoute = driverRoutes.some((route) => pathname.startsWith(route));

  if (isDriverRoute) {
    // Read active user role cookie/header if set, default buyer/driver
    const userRole = request.cookies.get("partmatch_user_role")?.value || "buyer";

    // Restricted roles for buyer-focused marketplace/garage routes
    const isSellerOrMechanic = userRole === "seller" || userRole === "mechanic";

    if (isSellerOrMechanic) {
      const redirectUrl = new URL("/onboarding", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/garage/:path*",
    "/diagnose/:path*",
    "/marketplace/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/orders/:path*",
  ],
};
