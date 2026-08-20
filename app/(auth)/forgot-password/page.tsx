"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { resetPassword } from "../actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await resetPassword(formData);
      if (result?.error) setError(result.error);
      else setSuccess(true);
    });
  }

  if (success) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 text-5xl">🔑</div>
        <h1 className="mb-3 font-display text-2xl font-bold">Check your inbox</h1>
        <p className="text-sm text-muted">
          If that email is registered, we sent a reset link. Check your spam too.
        </p>
        <Link href="/login" className="mt-6 block text-sm text-primary hover:underline">
          ← Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <Link href="/" className="mb-8 block font-display text-2xl font-bold tracking-tight text-center">
        Draft<span className="text-gradient">ly</span>
      </Link>
      <div className="rounded-3xl border border-border bg-surface p-8">
        <h1 className="mb-1 font-display text-xl font-bold">Reset password</h1>
        <p className="mb-6 text-sm text-muted">
          Enter your email and we&apos;ll send a reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted">
              Email
            </label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          {error && (
            <p className="rounded-xl bg-danger/10 px-4 py-2.5 text-sm text-danger">{error}</p>
          )}
          <Button type="submit" variant="primary" className="w-full" disabled={isPending}>
            {isPending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
        <p className="mt-5 text-center text-xs text-muted">
          Remember it?{" "}
          <Link href="/login" className="text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
