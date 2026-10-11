import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const userRoleCookie = request.cookies.get("partmatch_user_role")?.value;
  const userRole = userRoleCookie || "buyer";

  // Admin-only routes (R-05)
  if (pathname.startsWith("/admin")) {
    const isAdminAllowed = userRole === "admin" || !userRoleCookie; // allow initial setup if cookie unset
    if (!isAdminAllowed) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  // Seller-only routes (R-03)
  if (pathname.startsWith("/seller")) {
    if (!userRoleCookie && pathname.startsWith("/seller/onboarding")) {
      return NextResponse.next();
    }
    const isSellerRouteAllowed = userRole === "seller" || userRole === "admin" || !userRoleCookie;
    if (!isSellerRouteAllowed) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  // Mechanic-only routes (R-04)
  if (pathname.startsWith("/mechanic")) {
    if (!userRoleCookie && pathname.startsWith("/mechanic/onboarding")) {
      return NextResponse.next();
    }
    const isMechanicRouteAllowed = userRole === "mechanic" || userRole === "admin" || !userRoleCookie;
    if (!isMechanicRouteAllowed) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  // Driver/Fleet protected routes
  const driverRoutes = ["/garage", "/diagnose", "/marketplace", "/cart", "/checkout"];
  const isDriverRoute = driverRoutes.some((route) => pathname.startsWith(route));

  if (isDriverRoute) {
    const isSellerOrMechanic = userRole === "seller" || userRole === "mechanic";
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
