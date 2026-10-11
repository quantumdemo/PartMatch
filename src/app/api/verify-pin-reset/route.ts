import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export async function POST(req: NextRequest) {
  try {
    const { password, otp } = await req.json();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!password || !otp) {
      return NextResponse.json(
        { error: "Password and 6-digit OTP code are both required." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Verify user session token
    let userEmail = "";
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user?.email) userEmail = user.email;
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: "Unauthorized session. Please log in again." },
        { status: 401 }
      );
    }

    // Verify current password by attempting re-authentication
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { error: "Incorrect account password. Please check and try again." },
        { status: 400 }
      );
    }

    // Verify OTP code
    const { error: otpError } = await supabase.auth.verifyOtp({
      email: userEmail,
      token: otp,
      type: "email",
    });

    if (otpError) {
      return NextResponse.json(
        { error: "Invalid or expired OTP code. Please request a new code." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Identity verified successfully.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
