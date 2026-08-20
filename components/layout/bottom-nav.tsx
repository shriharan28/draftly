"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/generate", label: "Generate", icon: "✨" },
  { href: "/library", label: "Library", icon: "📚" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
  { href: "/billing", label: "Billing", icon: "💳" },
];

/** Mobile navigation — replaces the sidebar below md; thumb-reachable. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      {NAV.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium",
              active ? "text-foreground" : "text-muted"
            )}
          >
            <span
              className={cn(
                "grid h-8 w-8 place-items-center rounded-[10px] text-[15px]",
                active && "bg-primary"
              )}
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
