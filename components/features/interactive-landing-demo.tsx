/**
 * components/features/interactive-landing-demo.tsx
 *
 * Interactive Landing Page Studio Preview Component.
 * Typewriter effect + auto-cycling platform formats + instant preview.
 */
"use client";

import { useState, useEffect } from "react";
import { SparklesIcon } from "@/components/ui/icons";

type FormatKey = "x_thread" | "ig_caption" | "linkedin" | "reel_hook";

const DEMO_DATA: Record<FormatKey, { label: string; topic: string; output: React.ReactNode }> = {
  x_thread: {
    label: "X Thread",
    topic: "5 harsh truths about launching a SaaS in 2026",
    output: (
      <>
        <span className="font-mono text-[#8B5CF6] font-semibold block mb-1">
          1/5 — Direct Hype Hook
        </span>
        2026 is officially the year where building a SaaS is easy, but getting anyone to care is 100x harder. If you have 0 audience and 0 pre-launch distribution, read this: 🧵👇
        {"\n\n"}
        <span className="font-mono text-[#8B5CF6] font-semibold block mb-1">
          2/5 — The Distribution Trap
        </span>
        Most indie hackers spend 3 months polishing features and 0 days talking to users. In 2026, your product isn't your moat—your distribution loop is.
      </>
    ),
  },
  ig_caption: {
    label: "IG Caption",
    topic: "Why morning routines are overrated for productivity",
    output: (
      <>
        <span className="font-mono text-[#8B5CF6] font-semibold block mb-1">
          Option 1 — Bold Contrarian
        </span>
        Stop waking up at 4 AM just because a Twitter influencer told you to. 🚫
        {"\n\n"}
        Real productivity isn't about waking up before the sun—it's about protecting your deep focus hours when your energy peaks.
        {"\n\n"}
        Drop a 🔥 if you agree! #ProductivityTips #CreatorEconomy #WorkSmart
      </>
    ),
  },
  linkedin: {
    label: "LinkedIn",
    topic: "How we scaled our AI studio to 10k users in 30 days",
    output: (
      <>
        <span className="font-mono text-[#8B5CF6] font-semibold block mb-1">
          Option 1 — Founder Insights
        </span>
        We spent $0 on ads and grew from 0 to 10,000 active users in 30 days.
        {"\n\n"}
        Here are the 3 non-obvious growth levers we pulled:
        {"\n"}1. Built in public on X and LinkedIn daily
        {"\n"}2. Gave away 15 free credits without requiring a credit card
        {"\n"}3. Kept our UI brutally simple
        {"\n\n"}
        What's your #1 organic growth strategy this year?
      </>
    ),
  },
  reel_hook: {
    label: "Reel Hook",
    topic: "3 AI tools that will save you 10 hours a week",
    output: (
      <>
        <span className="font-mono text-[#8B5CF6] font-semibold block mb-1">
          Option 1 — High Energy Short Hook
        </span>
        [On-Screen Visual: Fast cut of phone screen showing Draftly AI studio]
        {"\n\n"}
        [Voiceover]: "Stop spending 3 hours writing captions manually! Here are 3 AI tools that do it in 5 seconds flat..."
      </>
    ),
  },
};

const FORMAT_KEYS: FormatKey[] = ["x_thread", "ig_caption", "linkedin", "reel_hook"];

export function InteractiveLandingDemo() {
  const [activeKey, setActiveKey] = useState<FormatKey>("x_thread");
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Handle Typewriter effect & auto-cycling
  useEffect(() => {
    const fullTopic = DEMO_DATA[activeKey].topic;
    setDisplayedText("");
    setIsTyping(true);

    let idx = 0;
    const timer = setInterval(() => {
      if (idx < fullTopic.length) {
        setDisplayedText(fullTopic.slice(0, idx + 1));
        idx++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 28);

    return () => clearInterval(timer);
  }, [activeKey]);

  // Auto-switch format every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveKey((prev) => {
        const nextIdx = (FORMAT_KEYS.indexOf(prev) + 1) % FORMAT_KEYS.length;
        return FORMAT_KEYS[nextIdx];
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="demo" className="mx-auto mt-14 max-w-4xl text-left">
      <div className="glass-panel relative overflow-hidden p-6 border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.6)] sm:p-8">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-[#8B5CF6]" />
            <h3 className="font-display text-base font-bold text-white">
              Interactive Studio Preview
            </h3>
          </div>
          <span className="font-mono text-xs text-[#8E8EA3]">Gemini 3.6 Flash</span>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {FORMAT_KEYS.map((key) => {
            const isActive = activeKey === key;
            return (
              <button
                key={key}
                onClick={() => setActiveKey(key)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/40 scale-105"
                    : "border border-white/10 bg-white/5 text-[#8E8EA3] hover:border-white/20 hover:text-white"
                }`}
              >
                {DEMO_DATA[key].label}
              </button>
            );
          })}
        </div>

        <div className="relative mb-4">
          <div className="w-full rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs text-[#F4F4FA] font-sans flex items-center min-h-[44px]">
            <span>{displayedText}</span>
            {isTyping && (
              <span className="inline-block h-3.5 w-0.5 bg-[#8B5CF6] ml-1 animate-pulse" />
            )}
          </div>
        </div>

        <div
          className={`rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs font-sans text-[#F4F4FA] leading-relaxed whitespace-pre-wrap transition-opacity duration-300 ${
            isTyping ? "opacity-50" : "opacity-100"
          }`}
        >
          {DEMO_DATA[activeKey].output}
        </div>
      </div>
    </div>
  );
}
