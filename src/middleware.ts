import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { pathname } = request.nextUrl;

  const adminSecretPath = process.env.ADMIN_SECRET_PATH || "/_admin_9x8k2p";
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith(adminSecretPath);

  if (isAdminRoute) {
    const userAgent = request.headers.get("user-agent") || "";
    const isMobile = /Mobile|Android|iP(hone|od|ad)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      userAgent
    );

    if (isMobile) {
      return new NextResponse(
        `<!DOCTYPE html><html><head><title>Admin Desktop Only</title><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="background:#FFFBF5;color:#121212;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;padding:20px;text-align:center;"><div style="background:#FFFFFF;border:1px solid #EAEAEA;padding:32px;border-radius:16px;max-width:400px;box-shadow:0 4px 12px rgba(0,0,0,0.05);"><h2 style="margin-top:0;font-size:18px;">Admin Desktop Only</h2><p style="color:#8A8A8A;font-size:14px;line-height:1.5;">The PartMatch Admin Portal is optimized for desktop management only. Please open this page on a desktop web browser.</p></div></body></html>`,
        { headers: { "content-type": "text/html" } }
      );
    }

    if (pathname.startsWith("/admin") && !pathname.startsWith(adminSecretPath) && process.env.NODE_ENV === "production") {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (!session) {
      return NextResponse.redirect(new URL("/onboarding/auth", request.url));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", session.user.id)
      .maybeSingle();

    const superAdminEmails = (process.env.SUPER_ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());
    const userEmail = (session.user.email || "").toLowerCase();
    const isAdminRole =
      profile?.role === "admin" || profile?.role === "super_admin" || profile?.role === "R-05";
    const isSuperAdminEmail = superAdminEmails.includes(userEmail);

    if (!isAdminRole && !isSuperAdminEmail) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    return response;
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return response;
  }

  if (pathname.startsWith("/onboarding")) {
    return response;
  }

  if (!session) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, kyc_status, pin_hash, bank_verified")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (!profile || !profile.role) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (profile.kyc_status !== "VERIFIED") {
    return NextResponse.redirect(new URL("/onboarding/kyc", request.url));
  }

  if (!profile.pin_hash) {
    return NextResponse.redirect(new URL("/onboarding/pin", request.url));
  }

  if (!profile.bank_verified && profile.role !== "R-01" && profile.role !== "buyer") {
    return NextResponse.redirect(new URL("/onboarding/bank", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
