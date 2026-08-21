"use client";

import { cn } from "@/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

/** Pill buttons — thumb-safe heights, glow on primary hover (UIUX brief §5). */
export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-all duration-200 ease-out active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        size === "sm" && "h-9 px-4 text-sm",
        size === "md" && "h-11 px-6 text-sm",
        size === "lg" && "h-12 px-8 text-base",
        variant === "primary" &&
          "bg-gradient-to-r from-primary to-[#6338FF] text-white shadow-[0_0_24px_var(--primary-glow)] hover:brightness-110 hover:shadow-[0_0_36px_var(--primary-glow)] hover:-translate-y-0.5",
        variant === "secondary" &&
          "border border-border bg-surface-2/80 text-foreground backdrop-blur hover:border-primary/40 hover:bg-surface-2",
        variant === "ghost" && "text-muted hover:text-foreground hover:bg-surface-2/50",
        variant === "danger" && "border border-danger/40 bg-danger/10 text-danger hover:bg-danger/20",
        className
      )}
    />
  );
}
