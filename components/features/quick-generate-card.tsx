"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const TYPES = [
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
  const [selectedType, setSelectedType] = useState("ig_caption");

  function handleGenerate() {
    if (!topic.trim()) return;
    router.push(`/generate?topic=${encodeURIComponent(topic)}&type=${selectedType}`);
  }

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-border bg-surface/80 p-8 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:border-primary/40">
      {/* Glow orb background behind card */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-[220px] w-[220px] rounded-full bg-primary/20 blur-3xl" />

      <h2 className="font-display text-2xl font-bold tracking-tight">Quick Generate</h2>
      <p className="mt-1 text-sm text-muted">
        Instant AI viral generation powered by Gemini 2.0 Flash
      </p>

      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
        placeholder="What do you want to post about today?"
        className="mt-6 h-13 w-full rounded-2xl border border-border bg-surface-2/80 px-5 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/20"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {TYPES.map((type) => {
          const active = selectedType === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelectedType(type.id)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
                active
                  ? "bg-primary text-white shadow-[0_0_16px_var(--primary-glow)] scale-105"
                  : "border border-border bg-surface-2/50 text-muted hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {type.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleGenerate}
          className="px-8"
        >
          <span>⚡ Generate 3 Variants</span>
          <span className="font-mono text-xs opacity-75">· 1 credit</span>
        </Button>
      </div>
    </div>
  );
}
