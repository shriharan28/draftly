/**
 * app/(app)/library/page.tsx
 *
 * Content Library Page Stub.
 * Zero emojis — Uses technical vector SVG icons.
 */
import { LibraryIcon } from "@/components/ui/icons";

export default function LibraryPage() {
  return (
    <div className="py-6">
      <div className="glass-panel p-8 text-center max-w-xl mx-auto">
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-[#8B5CF6] mx-auto">
          <LibraryIcon className="w-7 h-7" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white mb-2">
          Saved Content Library
        </h1>
        <p className="text-xs text-[#9494A8] leading-relaxed">
          Access all your previously generated AI posts, filter by platform, and export.
        </p>
      </div>
    </div>
  );
}
