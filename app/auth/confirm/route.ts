/**
 * app/auth/confirm/route.ts
 *
 * This is a Route Handler (server-only, no UI).
 * It handles the magic link in the verification email Supabase sends.
 *
 * The flow:
 * 1. User signs up → Supabase sends email with link: /auth/confirm?token_hash=...&type=signup
 * 2. User clicks link → browser hits THIS endpoint
 * 3. We exchange the token for a real session → set cookies → redirect to /onboarding
 *
 * WHY a Route Handler instead of a page?
 * We need to set HttpOnly cookies and redirect. That requires a proper HTTP response,
 * not a React component. Route Handlers let us write raw response logic.
 */
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as
    | "signup"
    | "recovery"
    | null;
  const next = requestUrl.searchParams.get("next") ?? "/onboarding";

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // Session is now set in cookies. Send them to onboarding.
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Something went wrong — show them an error page
  return NextResponse.redirect(new URL("/login?error=invalid_link", request.url));
}
