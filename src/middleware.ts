import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read user role from cookie or header (default to 'buyer')
  const userRoleCookie = request.cookies.get("partmatch_user_role")?.value;
  const userRole = userRoleCookie || "buyer";

  // Mechanic-only routes
  if (pathname.startsWith("/mechanic")) {
    // If no explicit cookie is set, allow mechanic onboarding for setup
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
