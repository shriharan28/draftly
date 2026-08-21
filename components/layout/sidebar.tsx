/**
 * components/layout/sidebar.tsx
 *
 * Desktop Navigation Sidebar. Watermelon UI theme.
 * Zero emojis — Uses technical vector SVG icons.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/(auth)/actions/auth";
import {
  DraftlyLogo,
  HomeIcon,
  SparklesIcon,
  LibraryIcon,
  SettingsIcon,
  CreditCardIcon,
  LogOutIcon,
  ZapIcon,
} from "@/components/ui/icons";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: <HomeIcon /> },
  { href: "/generate", label: "Generate Studio", icon: <SparklesIcon /> },
  { href: "/library", label: "Library", icon: <LibraryIcon /> },
  { href: "/settings", label: "Settings", icon: <SettingsIcon /> },
  { href: "/billing", label: "Billing", icon: <CreditCardIcon /> },
];

export function Sidebar({ userCredits = 15 }: { userCredits?: number }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/10 bg-[#030305]/80 backdrop-blur-2xl lg:flex">
      {/* BRAND BADGE */}
      <div className="flex h-20 items-center px-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-3.5 group">
          <DraftlyLogo className="w-9 h-9 transition-transform duration-300 group-hover:scale-105" />
          <span className="font-display text-2xl font-bold tracking-tight text-white">
            Draft<span className="text-[#10B981]">ly</span>
          </span>
        </Link>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1 space-y-1.5 p-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? "border border-[#8B5CF6]/40 bg-[#8B5CF6]/15 text-white shadow-[0_0_24px_rgba(139,92,246,0.25)]"
                  : "text-[#9494A8] hover:border hover:border-white/10 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className={active ? "text-[#8B5CF6]" : "text-[#9494A8]"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.href === "/generate" && (
                <span className="h-2 w-2 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER PLAN CARD & LOGOUT */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <div className="glass-panel p-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#9494A8]">Current Plan</span>
            <span className="rounded-full bg-[#8B5CF6]/20 px-2 py-0.5 text-[10px] font-semibold text-[#8B5CF6]">
              FREE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ZapIcon className="w-4 h-4 text-[#8B5CF6]" />
            <span className="font-display font-bold text-sm text-white">
              {userCredits} AI Credits
            </span>
          </div>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[#9494A8] transition hover:bg-white/5 hover:text-red-400"
          >
            <LogOutIcon className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
