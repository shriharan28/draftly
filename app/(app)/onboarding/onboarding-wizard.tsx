/**
 * app/(app)/onboarding/onboarding-wizard.tsx
 *
 * 3-step interactive Onboarding Wizard component.
 * Built directly from approved Mockup Gate 2 design.
 */
"use client";

import { useState, useTransition } from "react";
import { saveOnboarding } from "./actions";
import { Button } from "@/components/ui/button";

const NICHES = [
  { id: "tech", label: "Tech & SaaS", icon: "🚀", subtext: "AI, Software, Startups, Build in Public" },
  { id: "business", label: "Business & Finance", icon: "💼", subtext: "Entrepreneurship, Investing, Growth" },
  { id: "fitness", label: "Fitness & Health", icon: "💪", subtext: "Workouts, Nutrition, Biohacking" },
  { id: "creator", label: "Creator & Design", icon: "🎨", subtext: "Personal Brand, Art, Content Creation" },
];

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: "📸", subtext: "Carousels, Reel Hooks, Captions" },
  { id: "linkedin", label: "LinkedIn", icon: "💼", subtext: "Story Posts, Insights, Thought Leadership" },
  { id: "x", label: "X / Twitter", icon: "🐦", subtext: "Short Tweets, Value Threads" },
  { id: "short_video", label: "Short Video", icon: "🎬", subtext: "YouTube Shorts, TikTok Scripts" },
];

const TONES = [
  { id: "bold", label: "Bold & Punchy", icon: "⚡", subtext: "Short sentences, strong hooks, zero fluff" },
  { id: "educational", label: "Educational & Deep", icon: "🧠", subtext: "Structured, step-by-step, highly actionable" },
  { id: "casual", label: "Casual & Relatable", icon: "💬", subtext: "Conversational, witty, human feel" },
  { id: "contrarian", label: "Contrarian", icon: "🔥", subtext: "Challenges common wisdom, provokes debate" },
];

export function OnboardingWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [selectedNiche, setSelectedNiche] = useState("tech");
  const [targetAudience, setTargetAudience] = useState("Indie hackers & solo founders looking to build in public");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram", "linkedin", "x"]);
  const [selectedTone, setSelectedTone] = useState("bold");
  const [customRules, setCustomRules] = useState("Use minimal emojis. Speak directly to builders. Avoid corporate jargon.");

  function togglePlatform(id: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  function handleComplete() {
    setError(null);
    startTransition(async () => {
      const res = await saveOnboarding({
        niche: selectedNiche,
        targetAudience,
        platforms: selectedPlatforms,
        tonePreset: selectedTone,
        customRules,
      });

      if (res?.error) {
        setError(res.error);
      }
    });
  }

  return (
    <div className="relative mx-auto my-6 w-full max-w-[680px] overflow-hidden rounded-[28px] border border-border bg-surface p-6 shadow-2xl md:p-9">
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-[250px] w-[250px] rounded-full bg-primary/20 blur-3xl" />

      {/* Header & Progress */}
      <div className="mb-7">
        <div className="mb-5 text-center font-display text-xl font-bold">
          Draft<span className="text-gradient">ly</span>
        </div>

        {/* Progress Track */}
        <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="flex justify-between font-mono text-xs text-muted">
          <span>Step {step} of 3</span>
          <span>
            {step === 1 && "Niche & Audience"}
            {step === 2 && "Target Platforms"}
            {step === 3 && "Brand Voice & Tone"}
          </span>
        </div>
      </div>

      {/* STEP 1: Niche & Audience */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
          <h2 className="mb-2 font-display text-2xl font-bold tracking-tight">
            What&apos;s your core niche?
          </h2>
          <p className="mb-6 text-sm text-muted">
            Draftly uses this to tailor post angles, terminology, and viral formats for your domain.
          </p>

          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            {NICHES.map((item) => {
              const active = selectedNiche === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedNiche(item.id)}
                  className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-150 ${
                    active
                      ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(124,92,255,0.2)]"
                      : "border-border bg-surface-2 hover:border-primary/40"
                  }`}
                >
                  <span className="mb-2 text-2xl">{item.icon}</span>
                  <span className="font-semibold text-sm">{item.label}</span>
                  <span className="text-xs text-muted mt-1 leading-relaxed">{item.subtext}</span>
                </button>
              );
            })}
          </div>

          <div className="mb-6">
            <label htmlFor="audience" className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted">
              Who is your target audience?
            </label>
            <input
              id="audience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Early-stage founders, indie hackers, remote software engineers"
              className="w-full rounded-2xl border border-border bg-surface-2 px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center justify-between border-t border-border pt-5">
            <span className="text-xs text-muted">1/3 Complete</span>
            <Button variant="primary" onClick={() => setStep(2)}>
              Next: Platforms →
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Target Platforms */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
          <h2 className="mb-2 font-display text-2xl font-bold tracking-tight">
            Where do you post content?
          </h2>
          <p className="mb-6 text-sm text-muted">
            Select your primary channels. Draftly formats posts specifically for each platform&apos;s algorithm.
          </p>

          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            {PLATFORMS.map((item) => {
              const active = selectedPlatforms.includes(item.id);
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => togglePlatform(item.id)}
                  className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-150 ${
                    active
                      ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(124,92,255,0.2)]"
                      : "border-border bg-surface-2 hover:border-primary/40"
                  }`}
                >
                  <span className="mb-2 text-2xl">{item.icon}</span>
                  <span className="font-semibold text-sm">{item.label}</span>
                  <span className="text-xs text-muted mt-1 leading-relaxed">{item.subtext}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-border pt-5">
            <Button variant="secondary" onClick={() => setStep(1)}>
              ← Back
            </Button>
            <Button variant="primary" onClick={() => setStep(3)}>
              Next: Voice & Tone →
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Brand Voice & Tone */}
      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
          <h2 className="mb-2 font-display text-2xl font-bold tracking-tight">
            Define your Brand Voice
          </h2>
          <p className="mb-6 text-sm text-muted">
            Choose a tone persona or customize it so generated content actually sounds like you.
          </p>

          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            {TONES.map((item) => {
              const active = selectedTone === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedTone(item.id)}
                  className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-150 ${
                    active
                      ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(124,92,255,0.2)]"
                      : "border-border bg-surface-2 hover:border-primary/40"
                  }`}
                >
                  <span className="mb-2 text-2xl">{item.icon}</span>
                  <span className="font-semibold text-sm">{item.label}</span>
                  <span className="text-xs text-muted mt-1 leading-relaxed">{item.subtext}</span>
                </button>
              );
            })}
          </div>

          <div className="mb-6">
            <label htmlFor="rules" className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted">
              Custom Voice Rules (Optional)
            </label>
            <textarea
              id="rules"
              rows={3}
              value={customRules}
              onChange={(e) => setCustomRules(e.target.value)}
              placeholder="e.g. Use emojis sparingly. Avoid corporate jargon like 'synergy'. Always end tweets with a question."
              className="w-full rounded-2xl border border-border bg-surface-2 p-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {error && (
            <p className="mb-4 rounded-xl bg-danger/10 px-4 py-2.5 text-sm text-danger">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between border-t border-border pt-5">
            <Button variant="secondary" onClick={() => setStep(2)} disabled={isPending}>
              ← Back
            </Button>
            <Button variant="primary" onClick={handleComplete} disabled={isPending}>
              {isPending ? "Saving setup…" : "Complete Setup 🚀"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
