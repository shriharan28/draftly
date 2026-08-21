/**
 * app/(auth)/forgot-password/page.tsx
 *
 * Forgot Password Page. Watermelon UI theme.
 * Zero emojis — Uses technical vector SVG icons.
 */
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { resetPassword } from "@/app/(auth)/actions/auth";
import { Button } from "@/components/ui/button";
import { KeyIcon, MailIcon } from "@/components/ui/icons";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const formData = new FormData();
    formData.set("email", email);
    startTransition(async () => {
      const res = await resetPassword(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSent(true);
      }
    });
  }

  if (sent) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="glass-panel w-full max-w-md p-8 text-center">
          <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] mx-auto">
            <MailIcon className="w-8 h-8" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-2">
            Reset Link Sent
          </h1>
          <p className="text-xs text-[#9494A8] mb-6">
            If an account exists for {email}, you will receive password reset instructions.
          </p>
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            Back to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-[#8B5CF6]">
            <KeyIcon className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Reset your password
          </h1>
          <p className="mt-1 text-xs text-[#9494A8]">
            Enter your email address to receive a recovery link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-[11px] font-medium uppercase tracking-wider text-[#9494A8] mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-[#8B5CF6]"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            className="w-full h-12 bg-gradient-to-r from-[#8B5CF6] to-[#10B981]"
          >
            {isPending ? "Sending link…" : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-[#9494A8]">
          Remembered your password?{" "}
          <Link href="/login" className="font-semibold text-[#8B5CF6] hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
