/**
 * app/(app)/settings/settings-content.tsx
 *
 * Interactive Settings Client Component.
 * Brand Voice Persona tuning, profile preferences, and account management.
 */
"use client";

import { useState, useTransition } from "react";
import { updateBrandVoiceAction } from "./actions";
import { Button } from "@/components/ui/button";
import { PaywallModal } from "@/components/features/paywall-modal";
import { LockIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
  SettingsIcon,
  MicIcon,
  SparklesIcon,
  CreditCardIcon,
  ZapIcon,
} from "@/components/ui/icons";

export function SettingsContent({
  profile,
  brandVoice,
  subscriptionStatus,
  userCredits,
  userEmail,
}: {
  profile: { full_name?: string; niche?: string; tone?: string; target_audience?: string };
  brandVoice: { tone?: string; voice_instructions?: string };
  subscriptionStatus: string;
  userCredits: number;
  userEmail: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  const isPro = subscriptionStatus === "active";

  const [fullName, setFullName] = useState(profile.full_name || "");
  const [niche, setNiche] = useState(profile.niche || "tech");
  const [targetAudience, setTargetAudience] = useState(
    profile.target_audience || "Developers & Tech Enthusiasts"
  );
  const [tone, setTone] = useState(profile.tone || brandVoice.tone || "Bold & Punchy");
  const [voiceInstructions, setVoiceInstructions] = useState(
    brandVoice.voice_instructions || ""
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.set("fullName", fullName);
    formData.set("niche", niche);
    formData.set("targetAudience", targetAudience);
    formData.set("tone", tone);
    formData.set("voiceInstructions", voiceInstructions);

    startTransition(async () => {
      const res = await updateBrandVoiceAction(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  }

  return (
    <div className="space-y-8 py-2 max-w-4xl">
      {/* HEADER */}
      <div>
        <h1 className="font-display text-2xl font-bold text-white flex items-center gap-3">
          <SettingsIcon className="w-6 h-6 text-[#8B5CF6]" />
          <span>Brand Voice & Account Settings</span>
        </h1>
        <p className="text-xs text-[#9494A8] mt-1">
          Fine-tune your custom AI brand persona and manage your account parameters.
        </p>
      </div>

      {/* SECTION 1: BRAND VOICE TUNING */}
      <form onSubmit={handleSubmit} className="glass-panel p-7 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
            <MicIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white">
              AI Brand Voice Persona
            </h2>
            <p className="text-xs text-[#9494A8]">
              Gemini 2.0 Flash uses these preferences for every generated post variant.
            </p>
          </div>
        </div>

        {/* FULL NAME */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Full Name
          </label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Regan"
            className="h-11 text-xs"
          />
        </div>

        {/* NICHE SELECTOR */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Target Niche / Industry
          </label>
          <select
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="w-full h-11 rounded-xl border border-white/10 bg-[#0C0C12] px-4 text-xs text-white focus:border-[#8B5CF6] focus:outline-none"
          >
            <option value="tech">Tech & Software Engineering</option>
            <option value="saas">B2B SaaS & Entrepreneurship</option>
            <option value="business">Business & E-Commerce</option>
            <option value="marketing">Digital Marketing & Growth</option>
            <option value="fitness">Health & Fitness</option>
            <option value="design">Design & Creative Arts</option>
            <option value="creator">Content Creator & Media</option>
            <option value="lifestyle">Lifestyle & Personal Brand</option>
          </select>
        </div>

        {/* TARGET AUDIENCE */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Target Audience Description
          </label>
          <Input
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="e.g. Solo founders, developers, product designers"
            className="h-11 text-xs"
          />
        </div>

        {/* TONE OF VOICE */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Tone of Voice
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              "Bold & Punchy",
              "Educational & Clear",
              "Casual & Friendly",
              "Professional & Corporate",
              "Contrarian & Direct",
              "Storytelling & Inspiring",
            ].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={`p-3 rounded-xl text-xs font-medium text-center border transition-all ${
                  tone === t
                    ? "bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/30"
                    : "border-white/10 bg-white/5 text-[#9494A8] hover:border-white/20 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* CUSTOM INSTRUCTIONS */}
        <div className="space-y-2 relative">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Custom Brand Voice Instructions (Optional)
            </label>
            {!isPro && (
              <span className="rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 px-2 py-0.5 font-mono text-[9px] font-bold text-[#8B5CF6] flex items-center gap-1">
                <LockIcon className="w-2.5 h-2.5" />
                PRO FEATURE
              </span>
            )}
          </div>

          <div className="relative">
            <textarea
              value={isPro ? voiceInstructions : ""}
              onChange={(e) => isPro && setVoiceInstructions(e.target.value)}
              readOnly={!isPro}
              placeholder={
                isPro
                  ? "e.g. Use short sentences. Focus on actionable insights. Avoid buzzwords like 'synergy'."
                  : "🔒 Upgrade to Draftly Pro to unlock fine-tuning & custom brand voice rules."
              }
              rows={3}
              className={`w-full rounded-xl border p-3 text-xs outline-none transition-all ${
                isPro
                  ? "border-white/10 bg-[#0C0C12] text-white placeholder-[#9494A8] focus:border-[#8B5CF6]"
                  : "border-white/10 bg-white/5 text-[#9494A8] cursor-pointer placeholder-[#9494A8]/70 select-none"
              }`}
              onClick={() => {
                if (!isPro) setIsPaywallOpen(true);
              }}
            />
            {!isPro && (
              <button
                type="button"
                onClick={() => setIsPaywallOpen(true)}
                className="absolute inset-0 w-full h-full cursor-pointer flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-xl border border-[#8B5CF6]/30 opacity-0 hover:opacity-100 transition-opacity duration-200"
              >
                <span className="rounded-full bg-[#8B5CF6] text-white text-xs font-semibold px-4 py-1.5 shadow-lg shadow-[#8B5CF6]/40 flex items-center gap-1.5">
                  <LockIcon className="w-3.5 h-3.5" />
                  <span>Upgrade to Pro to Unlock</span>
                </span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded-xl bg-[#10B981]/10 p-3 text-xs text-[#10B981] border border-[#10B981]/20">
            ✓ Brand Voice preferences updated successfully!
          </p>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="bg-gradient-to-r from-[#8B5CF6] to-[#10B981] text-xs h-10 px-6"
        >
          <SparklesIcon className="w-4 h-4" />
          <span>{isPending ? "Saving..." : "Save Brand Voice Settings"}</span>
        </Button>
      </form>

      {/* SECTION 2: ACCOUNT & SUBSCRIPTION STATUS */}
      <div className="glass-panel p-7 space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#10B981]/15 text-[#10B981]">
              <CreditCardIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                Account & Subscription
              </h2>
              <p className="text-xs text-[#9494A8]">{userEmail}</p>
            </div>
          </div>

          <span
            className={`rounded-full px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${
              subscriptionStatus === "active"
                ? "bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981]"
                : "bg-white/10 border border-white/20 text-white"
            }`}
          >
            {subscriptionStatus === "active" ? "Draftly Pro Plan" : "Free Plan"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-[11px] font-mono uppercase text-[#9494A8] mb-1">
              Available Credits
            </div>
            <div className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <ZapIcon className="w-5 h-5 text-[#8B5CF6]" />
              <span>{userCredits}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-[11px] font-mono uppercase text-[#9494A8] mb-1">
              AI Engine Model
            </div>
            <div className="font-display text-base font-bold text-white flex items-center gap-2">
              <SparklesIcon className={`w-4 h-4 ${isPro ? "text-[#10B981]" : "text-[#8B5CF6]"}`} />
              <span>{isPro ? "Gemini 3.6 Flash Model" : "Gemini 2.5 Flash Model"}</span>
            </div>
          </div>
        </div>
      </div>

      <PaywallModal isOpen={isPaywallOpen} onClose={() => setIsPaywallOpen(false)} />
    </div>
  );
}
