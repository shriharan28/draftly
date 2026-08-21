"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { logout } from "@/app/(auth)/actions/auth";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/generate", label: "Generate Studio", icon: "✨" },
  { href: "/library", label: "Library", icon: "📚" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
  { href: "/billing", label: "Billing", icon: "💳" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-2 border-r border-white/10 bg-[#07070A]/85 p-5 backdrop-blur-2xl md:flex">
      {/* Brand Logo with Glowing Orb Accent */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 px-2 pb-6 pt-2 font-display text-2xl font-bold tracking-tight"
      >
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-[#7C5CFF] to-[#FF4ECD] text-sm text-white shadow-[0_0_20px_rgba(124,92,255,0.5)]">
          ⚡
        </div>
        <span>
          Draft<span className="text-gradient">ly</span>
        </span>
      </Link>

      <div className="space-y-1.5">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 cubic-bezier(0.16,1,0.3,1)",
                active
                  ? "border border-white/15 bg-white/10 text-white shadow-lg shadow-black/40 backdrop-blur-md"
                  : "text-[#8E8EA3] hover:bg-white/5 hover:text-white hover:translate-x-1"
              )}
            >
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-xl text-base transition-all duration-200",
                  active
                    ? "bg-[#7C5CFF] text-white shadow-[0_0_20px_rgba(124,92,255,0.6)]"
                    : "bg-white/5 group-hover:bg-white/10"
                )}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
              {active && (
                <div className="absolute right-3 h-2 w-2 rounded-full bg-[#7C5CFF] shadow-[0_0_10px_#7C5CFF]" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto space-y-3">
        {/* Pro Plan Status Card */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-[#8E8EA3]">
            <span>Current Plan</span>
            <span className="rounded-full bg-[#7C5CFF]/20 px-2 py-0.5 font-mono text-[10px] text-[#7C5CFF] border border-[#7C5CFF]/30">
              FREE
            </span>
          </div>
          <p className="mt-2 text-xs font-medium text-white">15 AI Credits Refreshed</p>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-2xl border border-transparent p-3 text-sm font-medium text-[#8E8EA3] transition-all duration-200 hover:border-white/10 hover:bg-white/5 hover:text-white"
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/5 text-base">
              🚪
            </span>
            <span>Log out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
