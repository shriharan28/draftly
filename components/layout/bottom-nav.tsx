/**
 * components/layout/bottom-nav.tsx
 *
 * Mobile Navigation Bar.
 * Zero emojis — Uses technical vector SVG icons.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  SparklesIcon,
  LibraryIcon,
  SettingsIcon,
  CreditCardIcon,
} from "@/components/ui/icons";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: <HomeIcon /> },
  { href: "/generate", label: "Generate", icon: <SparklesIcon /> },
  { href: "/library", label: "Library", icon: <LibraryIcon /> },
  { href: "/settings", label: "Settings", icon: <SettingsIcon /> },
  { href: "/billing", label: "Billing", icon: <CreditCardIcon /> },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-white/10 bg-[#030305]/90 backdrop-blur-xl py-2 lg:hidden">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 p-2 text-[11px] font-medium transition ${
              active ? "text-[#8B5CF6]" : "text-[#9494A8] hover:text-white"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
