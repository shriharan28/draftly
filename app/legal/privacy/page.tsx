/**
 * app/legal/privacy/page.tsx
 *
 * Plain language Privacy Policy for Draftly AI.
 */
import Link from "next/link";
import { DraftlyLogo } from "@/components/ui/icons";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F4F4FA] selection:bg-[#8B5CF6]/30">
      <header className="border-b border-white/10 bg-[#0A0A0F]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold text-white">
            <DraftlyLogo className="h-6 w-6" />
            <span>
              Draft<span className="text-[#8B5CF6]">ly</span> Privacy
            </span>
          </Link>
          <Link href="/" className="text-xs text-[#8E8EA3] hover:text-white transition">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl font-extrabold text-white mb-2">Privacy Policy</h1>
        <p className="text-xs text-[#8E8EA3] font-mono mb-8">Last Updated: August 2026</p>

        <div className="space-y-6 text-sm text-[#8E8EA3] leading-relaxed">
          <section className="glass-panel p-6 border border-white/10 rounded-2xl">
            <h2 className="font-display text-base font-semibold text-white mb-2">1. Data We Collect</h2>
            <p>
              We collect your account email address, profile preferences (such as niche and tone settings), and the prompts you input into our studio generator. We do NOT store your payment card numbers directly; all payment details are processed securely by Stripe.
            </p>
          </section>

          <section className="glass-panel p-6 border border-white/10 rounded-2xl">
            <h2 className="font-display text-base font-semibold text-white mb-2">2. How We Use Data</h2>
            <p>
              Your data is exclusively used to provide, personalize, and improve your content generation experience. We do NOT sell your personal data or user-generated prompts to third parties.
            </p>
          </section>

          <section className="glass-panel p-6 border border-white/10 rounded-2xl">
            <h2 className="font-display text-base font-semibold text-white mb-2">3. Account Deletion & Right to be Forgotten</h2>
            <p>
              You have full control over your data. You can delete your account and all associated generation records permanently at any time from your Account Settings page.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
