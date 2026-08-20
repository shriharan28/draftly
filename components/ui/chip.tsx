"use client";

import { cn } from "@/lib/cn";

type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
};

/** Pill chip for tone/niche/platform selectors; selected = primary fill. */
export function Chip({ selected = false, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      {...props}
      className={cn(
        "inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium",
        "transition-all duration-150 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        selected
          ? "border-primary bg-primary text-white"
          : "border-border bg-surface-2 text-muted hover:border-primary/40 hover:text-foreground",
        className
      )}
    />
  );
}
