/**
 * app/(auth)/login/login-form.tsx
 *
 * The actual login form — a "use client" component that can safely
 * call useSearchParams() because it's always wrapped in <Suspense>
 * by its parent (page.tsx).
 */
"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "../actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  const next = searchParams.get("next") || "/dashboard";
  const urlError = searchParams.get("error");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.set("next", next);

    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="w-full max-w-sm">
      <Link
        href="/"
        className="mb-8 block text-center font-display text-2xl font-bold tracking-tight"
      >
        Draft<span className="text-gradient">ly</span>
      </Link>

      <div className="rounded-3xl border border-border bg-surface p-8">
        <h1 className="mb-1 font-display text-xl font-bold">Welcome back</h1>
        <p className="mb-6 text-sm text-muted">Log in to continue creating.</p>

        {urlError === "invalid_link" && (
          <p className="mb-4 rounded-xl bg-warning/10 px-4 py-2.5 text-sm text-warning">
            That verification link has expired. Please log in and request a new one.
          </p>
        )}

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
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-medium text-muted">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-muted hover:text-primary">
                Forgot?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-danger/10 px-4 py-2.5 text-sm text-danger">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" className="w-full" disabled={isPending}>
            {isPending ? "Logging in…" : "Log in →"}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
