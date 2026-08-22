/**
 * app/page.tsx
 *
 * Stage 6: High-Converting Animated Draftly Landing Page.
 * Features GenZ-native dark mode aesthetics, cosmic grid mesh,
 * floating content creation icons, metallic gradient text shimmer,
 * interactive studio demo, live activity ticker, and pricing cards.
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DraftlyLogo,
  SparklesIcon,
  ZapIcon,
  MicIcon,
  LibraryIcon,
  RocketIcon,
  ReelIcon,
  TargetIcon,
} from "@/components/ui/icons";
import { InteractiveLandingDemo } from "@/components/features/interactive-landing-demo";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0F] text-[#F4F4FA] selection:bg-[#8B5CF6]/30 overflow-x-hidden">
      {/* BACKGROUND GRID MESH */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(circle at 50% 30%, black 20%, transparent 80%)",
        }}
      />

      {/* STATIC GLOW SPHERES */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[#8B5CF6]/15 blur-[140px]" />
      <div className="pointer-events-none absolute right-10 top-[40%] h-[450px] w-[450px] rounded-full bg-[#10B981]/10 blur-[130px]" />

      {/* STICKY NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0A0F]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-bold text-white">
            <DraftlyLogo className="h-7 w-7" />
            <span>
              Draft<span className="bg-gradient-to-r from-[#8B5CF6] to-[#FF4ECD] bg-clip-text text-transparent">ly</span>
            </span>
            <span className="rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-2 py-0.5 font-mono text-[10px] font-medium text-[#8B5CF6]">
              PRO v1.0
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#8E8EA3] md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#demo" className="transition hover:text-white">
              Studio Demo
            </a>
            <a href="#pricing" className="transition hover:text-white">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-xs font-semibold text-[#8E8EA3] hover:text-white">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="primary"
                className="h-9 px-4 text-xs font-semibold shadow-[0_0_24px_rgba(139,92,246,0.4)] bg-gradient-to-r from-[#8B5CF6] to-[#10B981]"
              >
                <span>Get Started Free</span>
                <ZapIcon className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 px-6 pt-20 pb-16 text-center">
        <div className="relative mx-auto max-w-4xl">
          {/* FLOATING ANIMATED CONTENT ICONS IN NEGATIVE SPACE */}
          <div className="hidden lg:block">
            {/* Left Top: Mic */}
            <div
              className="absolute -top-4 -left-16 z-20 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/15 text-[#8B5CF6] shadow-[0_0_24px_rgba(139,92,246,0.25)] backdrop-blur-xl transition hover:scale-125 duration-300 animate-bounce"
              style={{ animationDuration: "5s" }}
              title="Voice Persona"
            >
              <MicIcon className="w-6 h-6" />
            </div>

            {/* Left Middle: Target */}
            <div
              className="absolute top-28 -left-28 z-20 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FF4ECD]/30 bg-[#FF4ECD]/15 text-[#FF4ECD] shadow-[0_0_24px_rgba(255,78,205,0.25)] backdrop-blur-xl transition hover:scale-125 duration-300 animate-pulse"
              style={{ animationDuration: "6s" }}
              title="Target Audience"
            >
              <TargetIcon className="w-6 h-6" />
            </div>

            {/* Left Bottom: Reel */}
            <div
              className="absolute top-60 -left-16 z-20 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#10B981]/30 bg-[#10B981]/15 text-[#10B981] shadow-[0_0_24px_rgba(16,185,129,0.25)] backdrop-blur-xl transition hover:scale-125 duration-300 animate-bounce"
              style={{ animationDuration: "5.5s" }}
              title="Reels & Short Video"
            >
              <ReelIcon className="w-6 h-6" />
            </div>

            {/* Right Top: Sparkles */}
            <div
              className="absolute -top-4 -right-16 z-20 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FF4ECD]/30 bg-[#FF4ECD]/15 text-[#FF4ECD] shadow-[0_0_24px_rgba(255,78,205,0.25)] backdrop-blur-xl transition hover:scale-125 duration-300 animate-pulse"
              style={{ animationDuration: "5.2s" }}
              title="AI Sparkles"
            >
              <SparklesIcon className="w-6 h-6" />
            </div>

            {/* Right Middle: Lightning */}
            <div
              className="absolute top-28 -right-28 z-20 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/15 text-[#8B5CF6] shadow-[0_0_24px_rgba(139,92,246,0.25)] backdrop-blur-xl transition hover:scale-125 duration-300 animate-bounce"
              style={{ animationDuration: "6.2s" }}
              title="Instant Speed"
            >
              <ZapIcon className="w-6 h-6" />
            </div>

            {/* Right Bottom: Rocket */}
            <div
              className="absolute top-60 -right-16 z-20 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#10B981]/30 bg-[#10B981]/15 text-[#10B981] shadow-[0_0_24px_rgba(16,185,129,0.25)] backdrop-blur-xl transition hover:scale-125 duration-300 animate-pulse"
              style={{ animationDuration: "5.8s" }}
              title="Viral Growth"
            >
              <RocketIcon className="w-6 h-6" />
            </div>
          </div>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 px-4 py-1.5 font-mono text-xs text-[#F4F4FA] shadow-[0_0_16px_rgba(139,92,246,0.2)]">
            <SparklesIcon className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Powered by Gemini 3.7 Flash AI Model</span>
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-[1.15]">
            Turn Any Idea Into{" "}
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#FF4ECD] to-[#10B981] bg-clip-text text-transparent animate-pulse">
              3 Viral Posts
            </span>{" "}
            in 5 Seconds
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-[#8E8EA3] sm:text-lg">
            The GenZ-native AI Content Studio tuned to your authentic brand persona. Generate high-converting IG Captions, Reel Hooks, X Threads, and LinkedIn posts instantly.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button
                variant="primary"
                className="h-13 px-8 text-base font-semibold shadow-[0_0_36px_rgba(139,92,246,0.5)] bg-gradient-to-r from-[#8B5CF6] to-[#10B981] w-full sm:w-auto hover:scale-105 transition-all duration-200"
              >
                <ZapIcon className="w-5 h-5" />
                <span>Start Generating Free · 15 Credits</span>
              </Button>
            </Link>
          </div>

          {/* LIVE TICKER BADGE */}
          <div className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-[#8E8EA3]">
            <span className="h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-ping" />
            <span>4,892 posts generated today</span>
          </div>
        </div>

        {/* INTERACTIVE DEMO WIDGET */}
        <InteractiveLandingDemo />
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="relative z-10 border-t border-white/10 px-6 py-24 bg-white/[0.01]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold sm:text-4xl text-white">
              Engineered for Modern Content Creators
            </h2>
            <p className="mt-3 text-base text-[#8E8EA3]">
              Stop spending hours staring at a blank cursor. Draftly crafts ready-to-publish drafts in seconds.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="glass-panel p-8 transition duration-300 hover:border-[#8B5CF6]/50 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(139,92,246,0.15)]">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
                <MicIcon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">
                Brand Voice Persona
              </h3>
              <p className="text-xs text-[#8E8EA3] leading-relaxed">
                Teaches the AI your unique tone, keywords, and audience profile during onboarding so you never sound like generic AI fluff.
              </p>
            </div>

            <div className="glass-panel p-8 transition duration-300 hover:border-[#8B5CF6]/50 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(139,92,246,0.15)]">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
                <ZapIcon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">
                6 Multi-Platform Formats
              </h3>
              <p className="text-xs text-[#8E8EA3] leading-relaxed">
                Tailored prompt templates for IG Captions, Reel Scripts, full multi-tweet X Threads, LinkedIn posts, and YouTube descriptions.
              </p>
            </div>

            <div className="glass-panel p-8 transition duration-300 hover:border-[#8B5CF6]/50 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(139,92,246,0.15)]">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
                <LibraryIcon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">
                Transparent Credit Ledger
              </h3>
              <p className="text-xs text-[#8E8EA3] leading-relaxed">
                No hidden charges or forced monthly renewals. Every single credit deduction is tracked transparently in your append-only ledger.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="relative z-10 border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold sm:text-4xl text-white">
              Simple, Honest Pricing
            </h2>
            <p className="mt-3 text-base text-[#8E8EA3]">
              Start with 15 free credits on signup. Upgrade to Pro when you're ready to scale.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
            {/* STARTER CARD */}
            <div className="glass-panel p-8 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-white">Starter</h3>
                <div className="mt-4 font-display text-4xl font-extrabold text-white">
                  $0 <span className="text-sm font-normal text-[#8E8EA3]">/ forever</span>
                </div>
                <p className="mt-2 text-xs text-[#8E8EA3]">
                  Perfect for testing out Draftly with no credit card required.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-[#8E8EA3]">
                  <li className="flex items-center gap-2">
                    <span className="text-[#10B981]">✓</span> 15 Free Credits on Signup
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#10B981]">✓</span> All 6 Content Formats
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#10B981]">✓</span> Brand Voice Persona
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#10B981]">✓</span> Saved Content Library
                  </li>
                </ul>
              </div>

              <Link href="/signup" className="mt-8">
                <Button variant="secondary" className="w-full text-xs h-11">
                  Create Free Account
                </Button>
              </Link>
            </div>

            {/* PRO CARD */}
            <div className="glass-panel p-8 border-[#8B5CF6] shadow-[0_0_40px_rgba(139,92,246,0.25)] flex flex-col justify-between relative">
              <div className="absolute top-4 right-4 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 px-3 py-1 font-mono text-[10px] font-bold text-[#8B5CF6]">
                MOST POPULAR
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-white">Pro Creator</h3>
                <div className="mt-4 font-display text-4xl font-extrabold text-white">
                  $9 <span className="text-sm font-normal text-[#8E8EA3]">/ month</span>
                </div>
                <p className="mt-2 text-xs text-[#8E8EA3]">
                  For active creators and founders posting weekly.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-[#8E8EA3]">
                  <li className="flex items-center gap-2">
                    <span className="text-[#10B981]">✓</span> 500 Credits / Month
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#10B981]">✓</span> Priority Gemini 3.7 AI Access
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#10B981]">✓</span> Unlimited Library Storage
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#10B981]">✓</span> Priority Support
                  </li>
                </ul>
              </div>

              <Link href="/signup" className="mt-8">
                <Button
                  variant="primary"
                  className="w-full text-xs h-11 shadow-[0_0_24px_rgba(139,92,246,0.4)] bg-gradient-to-r from-[#8B5CF6] to-[#10B981]"
                >
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 px-6 text-xs text-[#8E8EA3]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <DraftlyLogo className="h-5 w-5" />
            <span className="font-display font-semibold text-white">Draftly AI</span>
            <span>© 2026 All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/legal/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="/legal/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
