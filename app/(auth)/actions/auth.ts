/**
 * app/(auth)/actions/auth.ts
 *
 * Server Actions for authentication.
 * "use server" means these functions ONLY run on the server.
 * They're called by our form components but execute in Vercel's cloud.
 *
 * WHY Server Actions instead of API routes for auth?
 * - Less boilerplate (no fetch(), no JSON.stringify/parse)
 * - Automatic CSRF protection built into Next.js
 * - Type-safe end-to-end (TypeScript catches mistakes)
 * - They can redirect() directly without a round-trip
 *
 * PATTERN: Every action returns { error: string | null }
 * so the form component always knows what happened.
 */
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// ============================================================
// SIGN UP
// ============================================================
export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = (formData.get("full_name") as string) || "";

  // Basic validation — never trust user input, even on the server
  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();

  // Get the current request origin so the verification email links back correctly
  const headersList = await headers();
  const origin = headersList.get("origin");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    // Map Supabase error codes to friendly messages
    if (error.message.includes("already registered")) {
      return { error: "An account with this email already exists. Try logging in." };
    }
    return { error: error.message };
  }

  // Update profile full_name if user exists
  if (data?.user && fullName) {
    await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", data.user.id);
  }

  // If Supabase returns a session immediately, email confirmation is disabled
  // (common in development) — redirect straight to onboarding.
  // If session is null, the user needs to verify their email first.
  if (data.session) {
    redirect("/onboarding");
  }

  // No session = email confirmation is ON → show the "check your email" message
  return { error: null, success: true };
}

// ============================================================
// LOG IN
// ============================================================
export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "/dashboard";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Supabase returns "Invalid login credentials" for both wrong email AND wrong password.
    // This is intentional — if we said "wrong password" we'd confirm the email exists.
    return { error: "Invalid email or password. Please try again." };
  }

  // redirect() throws an error internally (it's how Next.js works — don't catch it)
  redirect(next);
}

// ============================================================
// LOG OUT
// ============================================================
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ============================================================
// PASSWORD RESET — Step 1: send the email
// ============================================================
export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Please enter your email address." };
  }

  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin");

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/update-password`,
  });

  if (error) {
    return { error: error.message };
  }

  // Always return success even if email doesn't exist — prevents email enumeration attacks
  // (attackers using this to find out which emails are registered)
  return { error: null, success: true };
}
