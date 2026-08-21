/**
 * components/layout/header.tsx
 *
 * Header Bar with system status indicator, credits pill, and user avatar.
 */
"use client";

import Link from "next/link";
import { ZapIcon } from "@/components/ui/icons";

export function Header({
  credits = 15,
  userInitial = "U",
}: {
  credits?: number;
  userInitial?: string;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-[#030305]/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
        <span className="font-mono text-xs text-[#9494A8]">AI System Ready</span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/billing"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white transition hover:border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/10"
        >
          <ZapIcon className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>{credits} Credits</span>
        </Link>

        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#10B981] font-display text-sm font-bold text-white shadow-md shadow-[#8B5CF6]/20">
          {userInitial}
        </div>
      </div>
    </header>
  );
}
