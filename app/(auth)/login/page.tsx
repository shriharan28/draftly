/**
 * app/(auth)/login/page.tsx
 *
 * The login page. Same pattern as signup:
 * - Client Component for interactivity
 * - Calls Server Action for the actual auth logic
 *
 * KEY UX DECISIONS:
 * 1. Vague error message ("Invalid email or password") — never tell attackers
 *    whether the email exists or just the password was wrong
 * 2. ?next= param: if middleware redirected here from /generate, after login
 *    we send them back to /generate (not just /dashboard)
 * 3. Show error from URL if Supabase email link was invalid (?error=invalid_link)
 */

/**
 * WHY THE SUSPENSE WRAPPER?
 * useSearchParams() reads from the URL bar at runtime (in the browser).
 * Next.js tries to pre-render pages at build time as static HTML.
 * At build time, there's no URL — so useSearchParams() would crash.
 *
 * The fix: wrap the component that uses useSearchParams() in <Suspense>.
 * This tells Next.js: "this part renders only in the browser, not at build time".
 * The fallback shows a skeleton while the browser-side code loads.
 *
 * LESSON: Any hook that reads browser state (URL, window, document) inside
 * a "use client" component on a statically-generated page needs Suspense.
 */
import { Suspense } from "react";
import LoginForm from "./login-form";

// The outer page is a Server Component — no "use client" here.
// It just wraps the interactive form in a Suspense boundary.
export default function LoginPage() {
  return (
    <Suspense fallback={
      // Show a skeleton while the browser-side form loads
      <div className="w-full max-w-sm animate-pulse">
        <div className="mb-8 mx-auto h-8 w-24 rounded-lg bg-surface-2" />
        <div className="rounded-3xl border border-border bg-surface p-8 space-y-4">
          <div className="h-6 w-32 rounded bg-surface-2" />
          <div className="h-4 w-48 rounded bg-surface-2" />
          <div className="h-11 rounded-full bg-surface-2" />
          <div className="h-11 rounded-full bg-surface-2" />
          <div className="h-11 rounded-full bg-primary/30" />
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
