/**
 * app/(app)/onboarding/page.tsx
 *
 * Temporary placeholder — the real 3-step onboarding wizard comes
 * after Mockup Gate 2 (Stage 3, next session).
 *
 * Being inside (app)/ means:
 * - It's protected by the proxy (logged-out users can't reach it)
 * - It uses the app layout (sidebar + bottom nav)
 *
 * For now it just confirms auth is working and invites the user forward.
 */
export default function OnboardingPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 text-6xl">🎉</div>
      <h1 className="mb-3 font-display text-3xl font-bold">
        You&apos;re in!
      </h1>
      <p className="mb-2 text-muted">
        Auth is working. Your account is live. 15 credits are waiting.
      </p>
      <p className="text-sm text-muted">
        The onboarding wizard is coming next session — Stage 3 Part 2.
      </p>
      <a
        href="/dashboard"
        className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-white transition-all hover:shadow-[0_0_32px_var(--primary-glow)]"
      >
        Go to Dashboard →
      </a>
    </div>
  );
}
