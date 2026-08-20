/**
 * proxy.ts  (was: middleware.ts — renamed for Next.js 16)
 *
 * In Next.js 16, "middleware" was renamed to "proxy".
 * Same concept — runs before every request, before the page renders.
 * The exported function must now be named "proxy" (not "middleware").
 * The config.matcher export is no longer supported — proxy runs on all routes.
 *
 * What this does:
 * 1. Refreshes the user's Supabase session cookie (so it doesn't expire mid-use)
 * 2. Guards /(app) routes — redirects unauthenticated users to /login
 * 3. Saves ?next= so after login they land back where they wanted to go
 * 4. Redirects already-logged-in users away from /login and /signup
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Create a temporary Supabase client to refresh the session token.
  // JWT tokens expire every hour — this keeps users logged in automatically.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // SECURITY: Always use getUser(), not getSession().
  // getUser() verifies the token with Supabase's server — it can't be spoofed.
  // getSession() only reads the local cookie — an attacker could craft a fake one.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Skip static assets — no need to auth-check these
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/)
  ) {
    return supabaseResponse;
  }

  // --- PROTECTED ROUTES: require login ---
  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/generate") ||
    pathname.startsWith("/library") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/billing") ||
    pathname.startsWith("/onboarding");

  if (isAppRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // --- AUTH ROUTES: redirect if already logged in ---
  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}
