/**
 * app/(app)/generate/studio-generator.tsx
 *
 * Watermelon UI Inspired Content Studio React Component.
 * White-labeled AI Generation powered by Draftly AI & Supabase.
 * Zero emojis — Uses technical vector SVG icons throughout.
 */
"use client";

import { useState, useTransition } from "react";
import { generateContentAction } from "./actions";
import { ContentType, FORMAT_NAMES } from "@/lib/ai/prompts";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  InstagramIcon,
  ReelIcon,
  XIcon,
  LinkedInIcon,
  YouTubeIcon,
  SparklesIcon,
  MicIcon,
  ZapIcon,
  TargetIcon,
  LightbulbIcon,
} from "@/components/ui/icons";

const FORMATS: { id: ContentType; label: string; icon: React.ReactNode }[] = [
  { id: "ig_caption", label: "IG Caption", icon: <InstagramIcon className="w-5 h-5" /> },
  { id: "reel_hook", label: "Reel Hook", icon: <ReelIcon className="w-5 h-5" /> },
  { id: "x_thread", label: "X Thread", icon: <XIcon className="w-4 h-4" /> },
  { id: "x_post", label: "X Post", icon: <XIcon className="w-4 h-4" /> },
  { id: "linkedin_post", label: "LinkedIn", icon: <LinkedInIcon className="w-5 h-5" /> },
  { id: "yt_desc", label: "YouTube", icon: <YouTubeIcon className="w-5 h-5" /> },
];

export function StudioGenerator({
  initialTopic = "",
  initialType = "ig_caption",
}: {
  initialTopic?: string;
  initialType?: string;
}) {
  const [topic, setTopic] = useState(initialTopic);
  const [selectedFormat, setSelectedFormat] = useState<ContentType>(
    (initialType as ContentType) || "ig_caption"
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [variants, setVariants] = useState<{ angle: string; text: string }[] | null>(null);

  function handleGenerate() {
    if (!topic.trim()) {
      setError("Please enter a topic to generate content.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await generateContentAction({
        topic,
        contentType: selectedFormat,
      });

      if (res.error) {
        setError(res.error);
      } else if (res.variants) {
        setVariants(res.variants);
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
      {/* LEFT PANEL: CONTROL STUDIO */}
      <div className="glass-panel p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-[#8B5CF6]" />
            <h2 className="font-display text-lg font-bold text-white">Create Content</h2>
          </div>
        </div>

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-3.5 py-1.5 text-xs text-[#F4F4FA]">
          <MicIcon className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Voice Persona:</span>
          <span className="font-semibold text-[#8B5CF6]">Active Profile Settings</span>
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-[#9494A8]">
            Content Format
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {FORMATS.map((item) => {
              const active = selectedFormat === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedFormat(item.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3.5 text-xs font-medium transition-all duration-200 ${
                    active
                      ? "border-[#8B5CF6] bg-[#8B5CF6] text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] scale-[1.02]"
                      : "border-white/10 bg-white/5 text-[#9494A8] hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span className="grid h-6 w-6 place-items-center">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="topic" className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-[#9494A8]">
            What do you want to post about?
          </label>
          <textarea
            id="topic"
            rows={4}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. 5 harsh truths about launching a SaaS in 2026 without a pre-existing audience..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[#F4F4FA] outline-none transition duration-200 placeholder:text-[#9494A8] focus:border-[#8B5CF6] focus:ring-4 focus:ring-[#8B5CF6]/20"
          />
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">
            {error}
          </p>
        )}

        <Button
          type="button"
          variant="primary"
          onClick={handleGenerate}
          disabled={isPending}
          className="w-full h-13 text-base shadow-[0_0_32px_rgba(139,92,246,0.4)] bg-gradient-to-r from-[#8B5CF6] to-[#10B981]"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Generating with Draftly AI…</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ZapIcon className="w-4 h-4" />
              <span>Generate 3 AI Variants</span>
              <span className="font-mono text-xs opacity-80">· 1 credit</span>
            </span>
          )}
        </Button>
      </div>

      {/* RIGHT PANEL: AI VARIANTS OUTPUT */}
      <div className="glass-panel p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TargetIcon className="w-5 h-5 text-[#8B5CF6]" />
            <h2 className="font-display text-lg font-bold text-white">AI Generated Variants</h2>
          </div>
          <span className="font-mono text-xs text-[#9494A8]">
            {FORMAT_NAMES[selectedFormat]}
          </span>
        </div>

        {/* LOADING STATE THEATER */}
        {isPending && (
          <div className="flex min-h-[350px] flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
            <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full border-2 border-[#8B5CF6] opacity-75" />
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#10B981] text-xl shadow-lg shadow-[#8B5CF6]/50 text-white">
                <SparklesIcon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-shimmer font-display text-lg font-bold">
              Draftly AI is Writing…
            </p>
            <p className="mt-2 text-xs text-[#9494A8]">
              Structuring 3 high-converting variants tuned to your brand voice
            </p>
          </div>
        )}

        {/* EMPTY INITIAL STATE */}
        {!isPending && !variants && (
          <div className="flex min-h-[350px] flex-col items-center justify-center p-8 text-center border border-dashed border-white/10 rounded-2xl">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-[#8B5CF6]">
              <LightbulbIcon className="w-7 h-7" />
            </div>
            <h3 className="font-display text-base font-semibold text-white">Ready to generate</h3>
            <p className="mt-1 max-w-xs text-xs text-[#9494A8]">
              Enter a topic on the left and click Generate to produce 3 unique AI content angles.
            </p>
          </div>
        )}

        {/* VARIANTS LIST */}
        {!isPending && variants && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-200 hover:border-[#8B5CF6]/40 hover:bg-white/[0.07]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-[#8B5CF6]">
                    Option {index + 1} — {variant.angle || "AI Angle"}
                  </span>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#F4F4FA]">
                  {variant.text}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="font-mono text-xs text-[#9494A8]">
                    {variant.text.split(/\s+/).length} words · {variant.text.length} chars
                  </span>
                  <CopyButton text={variant.text} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
