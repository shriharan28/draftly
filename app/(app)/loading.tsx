/**
 * app/(app)/loading.tsx
 *
 * Instant loading skeleton for Next.js App Router route transitions.
 * Provides immediate feedback when switching between Dashboard, Settings, Library, etc.
 */
import { DraftlyLogo } from "@/components/ui/icons";

export default function Loading() {
  return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
      <div className="relative">
        <DraftlyLogo className="h-10 w-10 animate-pulse text-[#8B5CF6]" />
        <div className="absolute -inset-2 -z-10 rounded-full bg-[#8B5CF6]/20 blur-xl animate-pulse" />
      </div>
      <div className="flex items-center gap-2 font-mono text-xs text-[#8E8EA3]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6] animate-ping" />
        <span>Loading studio environment...</span>
      </div>
    </div>
  );
}
