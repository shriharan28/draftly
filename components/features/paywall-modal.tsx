/**
 * components/features/paywall-modal.tsx
 *
 * Interactive Subscription Paywall Modal.
 * Watermelon UI Theme · Zero Emojis · Technical Vector Icons.
 */
"use client";

import { useState, useTransition } from "react";
import { createCheckoutSession } from "@/app/(app)/billing/actions";
import { Button } from "@/components/ui/button";
import { ZapIcon, SparklesIcon, MicIcon, RocketIcon, DraftlyLogo } from "@/components/ui/icons";

export function PaywallModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  function handleUpgrade() {
    setError(null);
    startTransition(async () => {
      const res = await createCheckoutSession();
      if (res.error) {
        setError(res.error);
      } else if (res.url) {
        window.location.href = res.url;
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030305]/85 p-4 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-[#8B5CF6]/40 bg-[#0C0C12] p-8 text-center shadow-[0_0_60px_rgba(139,92,246,0.3)] animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-sm text-[#9494A8] transition hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>

        {/* OFFICIAL DRAFTLY BRAND LOGO */}
        <div className="mx-auto mb-5 flex items-center justify-center">
          <DraftlyLogo className="w-14 h-14" />
        </div>

        <h2 className="font-display text-2xl font-bold text-white mb-2">
          Upgrade to Draftly Pro
        </h2>
        <p className="text-xs text-[#9494A8] mb-6 leading-relaxed">
          Get 150 monthly AI credits and unlock full generation speed for $9/month.
        </p>

        {/* FEATURE HIGHLIGHTS */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-left space-y-3 text-xs text-[#F4F4FA]">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#9494A8] mb-2">
            PRO PLAN INCLUDES:
          </div>
          <div className="flex items-center gap-2.5">
            <ZapIcon className="w-4 h-4 text-[#8B5CF6]" />
            <span>150 AI Credits / Month</span>
          </div>
          <div className="flex items-center gap-2.5">
            <MicIcon className="w-4 h-4 text-[#10B981]" />
            <span>Custom Brand Voice Fine-tuning</span>
          </div>
          <div className="flex items-center gap-2.5">
            <RocketIcon className="w-4 h-4 text-[#8B5CF6]" />
            <span>Priority Gemini 3.6 Flash Model Queue</span>
          </div>
          <div className="flex items-center gap-2.5">
            <SparklesIcon className="w-4 h-4 text-[#10B981]" />
            <span>Unlimited Library Exports & Formats</span>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">
            {error}
          </p>
        )}

        <Button
          type="button"
          variant="primary"
          onClick={handleUpgrade}
          disabled={isPending}
          className="w-full h-12 text-sm bg-gradient-to-r from-[#8B5CF6] to-[#10B981] shadow-[0_0_24px_rgba(139,92,246,0.4)]"
        >
          {isPending ? "Connecting to Stripe…" : "Proceed to Secure Checkout →"}
        </Button>

        <p className="mt-3 text-[11px] text-[#9494A8]">
          Cancel anytime in 1-click. Encrypted by 256-bit Stripe Checkout.
        </p>
      </div>
    </div>
  );
}
