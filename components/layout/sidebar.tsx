"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { logout } from "@/app/(auth)/actions/auth";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/generate", label: "Generate", icon: "✨" },
  { href: "/library", label: "Library", icon: "📚" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
  { href: "/billing", label: "Billing", icon: "💳" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-2 border-r border-border bg-background/80 p-4 backdrop-blur-xl md:flex">
      <Link
        href="/dashboard"
        className="px-3 pb-5 pt-2 font-display text-[22px] font-bold tracking-tight"
      >
        Draft<span className="text-gradient">ly</span>
      </Link>

      {NAV.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-[14px] p-3 text-sm font-medium transition-all duration-200 ease-out",
              active
                ? "border border-border bg-surface-2 text-foreground shadow-sm"
                : "text-muted hover:bg-surface-2/60 hover:text-foreground hover:translate-x-1"
            )}
          >
            <span
              className={cn(
                "grid h-8 w-8 place-items-center rounded-[10px] text-[15px] transition-all duration-200",
                active
                  ? "bg-primary shadow-[0_0_24px_var(--primary-glow)] text-white"
                  : "bg-surface-2 group-hover:bg-surface-2/80"
              )}
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}

      <div className="mt-auto space-y-2">
        {/* Plan badge */}
        <div className="rounded-[14px] border border-border bg-surface/70 p-3.5 text-xs text-muted backdrop-blur">
          Free plan · <span className="font-medium text-foreground">Upgrade</span>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-[14px] p-3 text-sm font-medium text-muted transition-all duration-200 ease-out hover:bg-surface-2 hover:text-foreground"
          >
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-surface-2 text-[15px]">
              🚪
            </span>
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
