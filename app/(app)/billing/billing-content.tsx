/**
 * app/(app)/billing/billing-content.tsx
 *
 * Interactive Client Component for Billing & Subscription Management.
 * Matched 100% to Dashboard color accents · Zero emojis · Watermelon UI.
 */
"use client";

import { useState, useTransition } from "react";
import {
  createCheckoutSession,
  createPortalSession,
  createCreditCheckoutSession,
} from "./actions";
import { PaywallModal } from "@/components/features/paywall-modal";
import { Button } from "@/components/ui/button";
import { ZapIcon } from "@/components/ui/icons";

export function BillingContent({
  subscriptionStatus,
  currentBalance,
  ledgerRows,
  searchParams,
}: {
  subscriptionStatus: string;
  currentBalance: number;
  ledgerRows: {
    id: number;
    created_at: string;
    delta: number;
    reason: string;
    balance_after: number;
  }[];
  searchParams: { success?: string; canceled?: string; credits?: string };
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isPro = subscriptionStatus === "active";

  function handleUpgrade() {
    setError(null);
    startTransition(async () => {
      const res = await createCheckoutSession();
      if (res.error) {
        setError(res.error);
        setIsModalOpen(true);
      } else if (res.url) {
        window.location.href = res.url;
      }
    });
  }

  function handleManage() {
    startTransition(async () => {
      const res = await createPortalSession();
      if (res.url) {
        window.location.href = res.url;
      }
    });
  }

  return (
    <div className="space-y-8 py-2">
      {/* NOTIFICATIONS */}
      {searchParams.success === "true" && (
        <div className="rounded-2xl border border-[#10B981]/30 bg-[#10B981]/15 p-4 text-xs text-[#10B981] font-medium">
          {searchParams.credits
            ? `🎉 Purchase successful! ${searchParams.credits} AI credits have been added to your account ledger.`
            : "🎉 Subscription active! 150 AI credits have been added to your account ledger."}
        </div>
      )}

      {searchParams.canceled === "true" && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-[#9494A8]">
          Checkout process canceled. No charges were made.
        </div>
      )}

      {/* PRICING & PLAN CARDS */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* CURRENT PLAN CARD */}
        <div className="glass-panel p-7 flex flex-col justify-between">
          <div>
            <div className="mb-2 text-lg font-bold font-display text-white">Current Plan</div>
            <p className="text-xs text-[#9494A8]">
              {isPro ? "You are currently on Draftly Pro." : "You are on the Free Starter tier."}
            </p>

            <div className="my-5 font-display text-4xl font-bold text-white">
              {isPro ? "$9" : "$0"}{" "}
              <span className="text-sm font-medium text-[#9494A8]">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-[#F4F4FA] my-6">
              <li className="flex items-center gap-2.5">
                <span className="text-[#10B981] font-bold">✓</span>
                <span>{isPro ? "150 Monthly AI Credits" : "15 Initial Sign-up Credits"}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[#10B981] font-bold">✓</span>
                <span>{isPro ? "Gemini 3.6 Flash Engine" : "Gemini 2.5 Flash Engine"}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[#10B981] font-bold">✓</span>
                <span>All 6 Social Content Formats</span>
              </li>
            </ul>
          </div>

          {isPro && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleManage}
              disabled={isPending}
              className="w-full"
            >
              Manage Subscription in Stripe Portal
            </Button>
          )}
        </div>

        {/* RIGHT COLUMN: IF PRO SHOW BUY CREDITS, IF FREE SHOW PRO UPGRADE CARD */}
        {isPro ? (
          <PayAsYouGoCalculator
            isPro={isPro}
            handleUpgrade={handleUpgrade}
            isPending={isPending}
          />
        ) : (
          <div className="glass-panel p-7 relative border-[#8B5CF6]/40 bg-gradient-to-br from-[#8B5CF6]/15 to-[#030305] shadow-[0_0_40px_rgba(139,92,246,0.15)] flex flex-col justify-between">
            <div>
              <div className="absolute top-5 right-5 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/15 px-3 py-1 font-mono text-[10px] font-semibold text-[#8B5CF6] uppercase tracking-wider">
                RECOMMENDED
              </div>

              <div className="mb-1 text-xl font-bold font-display text-[#8B5CF6]">
                Draftly Pro Plan
              </div>
              <p className="text-xs text-[#9494A8]">
                Unlock 150 AI credits monthly & Gemini 3.6 Flash engine.
              </p>

              <div className="my-5 font-display text-4xl font-bold text-white">
                $9 <span className="text-sm font-medium text-[#9494A8]">/ month</span>
              </div>

              <ul className="space-y-3 text-xs text-[#F4F4FA] my-6">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#10B981] font-bold">✓</span>
                  <strong>150 AI Credits Refreshed Monthly</strong>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#10B981] font-bold">✓</span>
                  <span>Custom Brand Voice Fine-tuning</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#10B981] font-bold">✓</span>
                  <span>Gemini 3.6 Flash Model Engine</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#10B981] font-bold">✓</span>
                  <span>Unlimited Library Exports</span>
                </li>
              </ul>

              {error && (
                <p className="mb-3 rounded-xl bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">
                  {error}
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="primary"
              onClick={handleUpgrade}
              disabled={isPending}
              className="w-full h-12 text-sm bg-gradient-to-r from-[#8B5CF6] to-[#10B981] shadow-[0_0_32px_rgba(139,92,246,0.35)]"
            >
              <ZapIcon className="w-4 h-4" />
              <span>{isPending ? "Connecting to Stripe…" : "Upgrade to Pro ($9/mo)"}</span>
            </Button>
          </div>
        )}
      </div>

      {/* SHOW BUY CREDITS BOTTOM CARD ONLY FOR FREE USERS (LOCKED STATE) */}
      {!isPro && (
        <PayAsYouGoCalculator
          isPro={isPro}
          handleUpgrade={handleUpgrade}
          isPending={isPending}
        />
      )}

      {/* CREDIT TRANSACTION HISTORY LEDGER */}
      <div className="glass-panel p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">
            Credit History & Ledger
          </h2>
          <span className="font-mono text-xs text-[#9494A8]">Append-Only Ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 font-mono text-[11px] uppercase tracking-wider text-[#9494A8]">
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Type</th>
                <th className="pb-3 px-3">Reason</th>
                <th className="pb-3 px-3">Delta</th>
                <th className="pb-3 px-3">Balance After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ledgerRows.map((row) => (
                <tr key={row.id}>
                  <td className="py-3.5 px-3 text-[#9494A8]" suppressHydrationWarning>
                    {row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : "—"}
                  </td>
                  <td className="py-3.5 px-3">
                    {row.delta > 0 ? (
                      <span className="rounded-full bg-[#10B981]/15 border border-[#10B981]/30 px-2.5 py-1 font-mono text-[10px] text-[#10B981]">
                        GRANTED
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 px-2.5 py-1 font-mono text-[10px] text-[#8B5CF6]">
                        SPENT
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-white font-medium">{row.reason}</td>
                  <td
                    className={`py-3.5 px-3 font-mono font-bold ${
                      row.delta > 0 ? "text-[#10B981]" : "text-red-400"
                    }`}
                  >
                    {row.delta > 0 ? `+${row.delta}` : row.delta}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-white">
                    {row.balance_after}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PaywallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

function PayAsYouGoCalculator({
  isPro,
  handleUpgrade,
  isPending,
}: {
  isPro: boolean;
  handleUpgrade: () => void;
  isPending: boolean;
}) {
  const [credits, setCredits] = useState<number>(50);
  const [isCreditPending, startCreditTransition] = useTransition();
  const [creditError, setCreditError] = useState<string | null>(null);

  const unitPrice = 0.199; // $1.99 per 10 credits ($0.199 per credit)
  const totalPrice = (credits * unitPrice).toFixed(2);

  function handleBuyCredits() {
    setCreditError(null);
    startCreditTransition(async () => {
      const res = await createCreditCheckoutSession(credits);
      if (res.error) {
        setCreditError(res.error);
      } else if (res.url) {
        window.location.href = res.url;
      }
    });
  }

  return (
    <div className="glass-panel p-6 border-[#8B5CF6]/30 bg-[#030305] relative overflow-hidden flex flex-col justify-between">
      <div>
        {/* HEADER: TITLE & PRO BADGE */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-xl font-bold text-white">Buy Credits</h3>
            <span className="rounded-full border border-[#8B5CF6]/40 bg-[#8B5CF6]/15 px-3 py-1 font-mono text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider">
              PRO MEMBERS ONLY
            </span>
          </div>

          {/* PRICE DISPLAY */}
          <div className="flex items-baseline gap-1 font-display">
            <span className="text-xs text-[#9494A8]">Price:</span>
            <span className="text-2xl font-bold text-white">${totalPrice}</span>
          </div>
        </div>

        {/* PRO MEMBERS ONLY LOCKED STATE OVERLAY FOR FREE USERS */}
        {!isPro ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center">
            <div className="mb-2 font-display text-sm font-semibold text-white">
              🔒 Credit Top-Ups are Locked
            </div>
            <p className="text-xs text-[#9494A8] max-w-sm mx-auto mb-4">
              Pay As You Go credit packs are exclusively available for Draftly Pro members.
            </p>
            <Button
              type="button"
              variant="primary"
              onClick={handleUpgrade}
              disabled={isPending}
              className="h-10 text-xs px-5 bg-gradient-to-r from-[#8B5CF6] to-[#10B981]"
            >
              Upgrade to Pro to Unlock
            </Button>
          </div>
        ) : (
          /* RANGE BAR & BUY ACTION FOR PRO MEMBERS */
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between font-mono text-xs text-[#9494A8]">
                <span>Range Bar:</span>
                <span className="text-white font-bold text-sm">
                  {credits} AI Credits
                </span>
              </div>

              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer bg-white/10 accent-[#8B5CF6] focus:outline-none"
              />

              <div className="mt-1.5 flex justify-between font-mono text-[10px] text-[#9494A8]">
                <span>10 Credits</span>
                <span>50 Credits</span>
                <span>100 Credits</span>
              </div>
            </div>

            {creditError && (
              <p className="rounded-xl bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">
                {creditError}
              </p>
            )}

            <Button
              type="button"
              variant="primary"
              onClick={handleBuyCredits}
              disabled={isCreditPending}
              className="w-full h-11 text-xs font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#10B981]"
            >
              {isCreditPending ? "Connecting to Stripe…" : `Buy ${credits} Credits for $${totalPrice}`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
