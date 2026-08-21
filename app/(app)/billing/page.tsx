/**
 * app/(app)/billing/page.tsx
 *
 * Billing & Subscription Page Stub.
 * Zero emojis — Uses technical vector SVG icons.
 */
import { CreditCardIcon } from "@/components/ui/icons";

export default function BillingPage() {
  return (
    <div className="py-6">
      <div className="glass-panel p-8 text-center max-w-xl mx-auto">
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-[#8B5CF6] mx-auto">
          <CreditCardIcon className="w-7 h-7" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white mb-2">
          Billing & Subscription
        </h1>
        <p className="text-xs text-[#9494A8] leading-relaxed">
          Upgrade to Draftly Pro ($9/mo) for 300 monthly credits and custom voice fine-tuning.
        </p>
      </div>
    </div>
  );
}
