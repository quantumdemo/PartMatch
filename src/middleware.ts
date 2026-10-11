import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const userRoleCookie = request.cookies.get("partmatch_user_role")?.value;

  // Admin-only routes (R-05)
  if (pathname.startsWith("/admin")) {
    if (!userRoleCookie || userRoleCookie !== "admin") {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  // Seller-only routes (R-03)
  if (pathname.startsWith("/seller")) {
    if (pathname.startsWith("/seller/onboarding") && !userRoleCookie) {
      return NextResponse.next();
    }
    if (!userRoleCookie || (userRoleCookie !== "seller" && userRoleCookie !== "admin")) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  // Mechanic-only routes (R-04)
  if (pathname.startsWith("/mechanic")) {
    if (pathname.startsWith("/mechanic/onboarding") && !userRoleCookie) {
      return NextResponse.next();
    }
    if (!userRoleCookie || (userRoleCookie !== "mechanic" && userRoleCookie !== "admin")) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  // Driver/Fleet protected routes
  const driverRoutes = ["/garage", "/diagnose", "/marketplace", "/cart", "/checkout"];
  const isDriverRoute = driverRoutes.some((route) => pathname.startsWith(route));

  if (isDriverRoute && userRoleCookie) {
    const isSellerOrMechanic = userRoleCookie === "seller" || userRoleCookie === "mechanic";
    if (isSellerOrMechanic) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/seller/:path*",
    "/mechanic/:path*",
    "/garage/:path*",
    "/diagnose/:path*",
    "/marketplace/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/delivery/:path*",
  ],
};
