/**
 * app/(app)/onboarding/onboarding-wizard.tsx
 *
 * 3-Step Animated Onboarding Wizard.
 * Zero emojis — Uses technical vector SVG icons.
 */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveOnboarding } from "./actions";
import { Button } from "@/components/ui/button";
import {
  RocketIcon,
  BriefcaseIcon,
  DumbbellIcon,
  PaletteIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
  ReelIcon,
  ZapIcon,
  BrainIcon,
  MessageIcon,
  FlameIcon,
} from "@/components/ui/icons";

const NICHES = [
  { id: "tech", label: "Tech & SaaS", icon: <RocketIcon className="w-5 h-5 text-[#8B5CF6]" />, subtext: "AI, Software, Startups, Build in Public" },
  { id: "business", label: "Business & Finance", icon: <BriefcaseIcon className="w-5 h-5 text-[#10B981]" />, subtext: "Entrepreneurship, Investing, Growth" },
  { id: "fitness", label: "Fitness & Health", icon: <DumbbellIcon className="w-5 h-5 text-amber-400" />, subtext: "Workouts, Nutrition, Biohacking" },
  { id: "creator", label: "Creator & Design", icon: <PaletteIcon className="w-5 h-5 text-pink-400" />, subtext: "Personal Brand, Art, Content Creation" },
];

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: <InstagramIcon className="w-5 h-5" />, subtext: "Carousels, Reel Hooks, Captions" },
  { id: "linkedin", label: "LinkedIn", icon: <LinkedInIcon className="w-5 h-5" />, subtext: "Story Posts, Insights, Thought Leadership" },
  { id: "x", label: "X / Twitter", icon: <XIcon className="w-4 h-4" />, subtext: "Short Tweets, Value Threads" },
  { id: "short_video", label: "Short Video", icon: <ReelIcon className="w-5 h-5" />, subtext: "YouTube Shorts, TikTok Scripts" },
];

const TONES = [
  { id: "bold", label: "Bold & Punchy", icon: <ZapIcon className="w-5 h-5 text-[#8B5CF6]" />, subtext: "Short sentences, strong hooks, zero fluff" },
  { id: "educational", label: "Educational & Deep", icon: <BrainIcon className="w-5 h-5 text-[#10B981]" />, subtext: "Structured, step-by-step, highly actionable" },
  { id: "casual", label: "Casual & Relatable", icon: <MessageIcon className="w-5 h-5 text-sky-400" />, subtext: "Conversational, witty, human feel" },
  { id: "contrarian", label: "Contrarian", icon: <FlameIcon className="w-5 h-5 text-rose-500" />, subtext: "Challenges common wisdom, provokes debate" },
];

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedNiche, setSelectedNiche] = useState("tech");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram", "linkedin"]);
  const [selectedTone, setSelectedTone] = useState("bold");
  const [sampleWriting, setSampleWriting] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function togglePlatform(id: string) {
    if (selectedPlatforms.includes(id)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((p) => p !== id));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, id]);
    }
  }

  function handleComplete() {
    setError(null);
    startTransition(async () => {
      const res = await saveOnboarding({
        niche: selectedNiche,
        targetAudience: selectedNiche === "tech" ? "Software Engineers & Founders" : "Ambitious Professionals",
        platforms: selectedPlatforms,
        tonePreset: selectedTone,
        customRules: sampleWriting,
      });

      if (res.error) {
        setError(res.error);
      } else {
        router.push("/dashboard");
      }
    });
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* STEP INDICATORS */}
      <div className="mb-8 flex items-center justify-between px-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`grid h-8 w-8 place-items-center rounded-full font-mono text-xs font-bold transition-all duration-300 ${
                step === i
                  ? "bg-[#8B5CF6] text-white shadow-[0_0_16px_rgba(139,92,246,0.5)] scale-110"
                  : step > i
                  ? "bg-[#10B981] text-white"
                  : "bg-white/10 text-[#9494A8]"
              }`}
            >
              {step > i ? "✓" : i}
            </div>
            <span className="hidden sm:inline text-xs text-[#9494A8]">
              {i === 1 ? "Niche" : i === 2 ? "Platforms" : "Brand Voice"}
            </span>
          </div>
        ))}
      </div>

      <div className="glass-panel p-8">
        {/* STEP 1: NICHE SELECTION */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="font-display text-xl font-bold text-white">
                What is your core niche?
              </h2>
              <p className="text-xs text-[#9494A8] mt-1">
                Draftly tunes AI prompts to match your domain's exact terminology.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {NICHES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedNiche(item.id)}
                  className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                    selectedNiche === item.id
                      ? "border-[#8B5CF6] bg-[#8B5CF6]/15 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5">
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-white">
                      {item.label}
                    </h3>
                    <p className="text-xs text-[#9494A8] mt-0.5">{item.subtext}</p>
                  </div>
                </button>
              ))}
            </div>

            <Button
              type="button"
              variant="primary"
              onClick={() => setStep(2)}
              className="w-full h-12 bg-gradient-to-r from-[#8B5CF6] to-[#10B981]"
            >
              Continue to Platforms
            </Button>
          </div>
        )}

        {/* STEP 2: PLATFORMS SELECTION */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="font-display text-xl font-bold text-white">
                Where do you publish?
              </h2>
              <p className="text-xs text-[#9494A8] mt-1">
                Select your primary platforms (you can select multiple).
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {PLATFORMS.map((item) => {
                const isSelected = selectedPlatforms.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => togglePlatform(item.id)}
                    className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-[#8B5CF6] bg-[#8B5CF6]/15 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5">
                      {item.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-sm font-semibold text-white">
                          {item.label}
                        </h3>
                        {isSelected && (
                          <span className="text-xs text-[#10B981] font-semibold">Selected</span>
                        )}
                      </div>
                      <p className="text-xs text-[#9494A8] mt-0.5">{item.subtext}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(1)}
                className="w-1/3"
              >
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => setStep(3)}
                className="w-2/3 bg-gradient-to-r from-[#8B5CF6] to-[#10B981]"
              >
                Continue to Voice
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: BRAND VOICE SETUP */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="font-display text-xl font-bold text-white">
                Define your brand tone
              </h2>
              <p className="text-xs text-[#9494A8] mt-1">
                Choose a tone persona and optionally paste a sample post.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {TONES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedTone(item.id)}
                  className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
                    selectedTone === item.id
                      ? "border-[#8B5CF6] bg-[#8B5CF6]/15 shadow-[0_0_16px_rgba(139,92,246,0.3)]"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <span className="mb-2 grid h-8 w-8 place-items-center rounded-xl bg-white/5">
                    {item.icon}
                  </span>
                  <h3 className="font-display text-xs font-semibold text-white">
                    {item.label}
                  </h3>
                  <p className="text-[11px] text-[#9494A8] mt-1 line-clamp-2">
                    {item.subtext}
                  </p>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#9494A8] mb-2">
                Sample Writing (Optional)
              </label>
              <textarea
                rows={3}
                value={sampleWriting}
                onChange={(e) => setSampleWriting(e.target.value)}
                placeholder="Paste a past post you loved. Draftly will emulate your vocabulary and style structure..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white outline-none transition placeholder:text-[#9494A8] focus:border-[#8B5CF6]"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(2)}
                className="w-1/3"
              >
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                disabled={isPending}
                onClick={handleComplete}
                className="w-2/3 h-12 bg-gradient-to-r from-[#8B5CF6] to-[#10B981] shadow-[0_0_24px_rgba(139,92,246,0.4)]"
              >
                {isPending ? "Saving setup…" : "Complete Setup"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
