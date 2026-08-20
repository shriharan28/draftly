/**
 * app/(auth)/signup/page.tsx
 *
 * The signup page. This is a Client Component because we need:
 * - useState (to track form state, errors, loading)
 * - Form interactivity (inline validation, button loading state)
 *
 * It calls our Server Action (signUp) which runs on the server.
 * "use client" + Server Action = best of both worlds.
 */
"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { signUp } from "../actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // useTransition: marks the Server Action call as a "transition"
  // so isPending becomes true while it's running — perfect for loading states
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await signUp(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  }

  // ---- CHECK YOUR EMAIL STATE ----
  if (success) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 text-5xl">📬</div>
        <h1 className="mb-3 font-display text-2xl font-bold">Check your inbox</h1>
        <p className="text-sm text-muted">
          We sent a verification link to your email. Click it to activate your
          account and get your 15 free credits.
        </p>
        <p className="mt-6 text-xs text-muted">
          Wrong email?{" "}
          <button
            onClick={() => setSuccess(false)}
            className="text-primary hover:underline"
          >
            Go back
          </button>
        </p>
      </div>
    );
  }

  // ---- SIGNUP FORM ----
  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <Link
        href="/"
        className="mb-8 block font-display text-2xl font-bold tracking-tight text-center"
      >
        Draft<span className="text-gradient">ly</span>
      </Link>

      <div className="rounded-3xl border border-border bg-surface p-8">
        <h1 className="mb-1 font-display text-xl font-bold">Create your account</h1>
        <p className="mb-6 text-sm text-muted">
          Start free — 15 credits, no card needed.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-muted">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          {/* Error message — only shows when there's an error */}
          {error && (
            <p className="rounded-xl bg-danger/10 px-4 py-2.5 text-sm text-danger">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Creating account…" : "Get started free →"}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
