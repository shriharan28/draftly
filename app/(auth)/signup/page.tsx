/**
 * app/(auth)/signup/page.tsx
 *
 * Signup Page. Watermelon UI theme.
 * Zero emojis — Uses technical vector SVG icons.
 */
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signUp } from "../actions/auth";
import { Button } from "@/components/ui/button";
import { MailIcon, ZapIcon } from "@/components/ui/icons";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);
    formData.set("full_name", fullName);

    startTransition(async () => {
      const res = await signUp(formData);
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
        <div className="glass-panel w-full max-w-md p-8 text-center animate-in fade-in duration-300">
          <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6] mx-auto">
            <MailIcon className="w-8 h-8" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-2">
            Check your inbox
          </h1>
          <p className="text-xs text-[#9494A8] leading-relaxed mb-6">
            We sent a verification link to {email}. Click the link to complete registration and access Draftly.
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
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#10B981] shadow-lg shadow-[#8B5CF6]/30">
            <ZapIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Create your account
          </h1>
          <p className="mt-1 text-xs text-[#9494A8]">
            Get 15 free AI credits instantly on registration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-[11px] font-medium uppercase tracking-wider text-[#9494A8] mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Deepak Kumar"
              className="w-full h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-[#8B5CF6]"
            />
          </div>

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

          <div>
            <label htmlFor="password" className="block text-[11px] font-medium uppercase tracking-wider text-[#9494A8] mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
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
            {isPending ? "Creating account…" : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-[#9494A8]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#8B5CF6] hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
