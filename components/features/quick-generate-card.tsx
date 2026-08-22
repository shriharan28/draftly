/**
 * components/features/quick-generate-card.tsx
 *
 * Hero Quick Generator Card for Dashboard.
 * Zero emojis — Uses technical vector SVG icons.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ZapIcon, SparklesIcon } from "@/components/ui/icons";
import { ContentType, FORMAT_NAMES } from "@/lib/ai/prompts";

const TYPES: { id: ContentType; label: string }[] = [
  { id: "ig_caption", label: "IG Caption" },
  { id: "reel_hook", label: "Reel Hook" },
  { id: "x_thread", label: "X Thread" },
  { id: "x_post", label: "X Post" },
  { id: "linkedin_post", label: "LinkedIn" },
  { id: "yt_desc", label: "YouTube" },
];

export function QuickGenerateCard() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [selectedType, setSelectedType] = useState<ContentType>("ig_caption");

  function handleGenerate() {
    if (!topic.trim()) return;
    const query = new URLSearchParams({
      topic,
      type: selectedType,
    }).toString();
    router.push(`/generate?${query}`);
  }

  return (
    <div className="glass-panel relative overflow-hidden p-6 md:p-8">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#8B5CF6]/15 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#10B981]/15 blur-3xl" />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-[#8B5CF6]" />
            <h2 className="font-display text-xl font-bold text-white">
              Instant AI Content Studio
            </h2>
          </div>
          <span className="font-mono text-xs text-[#9494A8]">
            Gemini 3.7 Flash Model
          </span>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {TYPES.map((t) => {
            const active = selectedType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedType(t.id)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? "border-[#8B5CF6] bg-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                    : "border-white/10 bg-white/5 text-[#9494A8] hover:border-white/20 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mb-4">
          <textarea
            rows={3}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What would you like to post about today? (e.g., 3 lessons launching a product in 2026)..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white outline-none transition placeholder:text-[#9494A8] focus:border-[#8B5CF6] focus:ring-4 focus:ring-[#8B5CF6]/20"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-[#9494A8]">
            Generates 3 distinct post variants tuned to your brand voice.
          </p>
          <Button
            type="button"
            variant="primary"
            onClick={handleGenerate}
            className="shrink-0 bg-gradient-to-r from-[#8B5CF6] to-[#10B981] shadow-[0_0_24px_rgba(139,92,246,0.3)]"
          >
            <span className="flex items-center gap-2">
              <ZapIcon className="w-4 h-4" />
              <span>Generate 3 Variants</span>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
