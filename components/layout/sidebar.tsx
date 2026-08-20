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
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-2 border-r border-border p-4 md:flex">
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
              "flex items-center gap-3 rounded-[14px] p-3 text-sm font-medium transition-all duration-150 ease-out",
              active
                ? "bg-surface-2 text-foreground"
                : "text-muted hover:bg-surface-2 hover:text-foreground"
            )}
          >
            <span
              className={cn(
                "grid h-8 w-8 place-items-center rounded-[10px] text-[15px] transition-all duration-150",
                active
                  ? "bg-primary shadow-[0_0_24px_var(--primary-glow)]"
                  : "bg-surface-2"
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
        <div className="rounded-[14px] border border-border bg-surface p-3 text-xs text-muted">
          Free plan · <span className="font-medium text-foreground">Upgrade</span>
        </div>

        {/*
          LESSON: Calling a server action from a client component.
          We can't call logout() directly in an onClick because that would
          try to run server code in the browser. Instead, we use a <form>
          with action={logout}. When submitted, Next.js sends the form to
          the server, runs logout(), then follows the redirect().
          This is the correct, secure pattern.
        */}
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-[14px] p-3 text-sm font-medium text-muted transition-all duration-150 ease-out hover:bg-surface-2 hover:text-foreground"
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
