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
        "inline-flex items-center justify-center gap-2 rounded-full font-medium",
        "transition-all duration-150 ease-out active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        size === "sm" && "h-9 px-4 text-sm",
        size === "md" && "h-11 px-6 text-sm",
        size === "lg" && "h-12 px-8 text-base",
        variant === "primary" &&
          "bg-primary text-white hover:shadow-[0_0_32px_var(--primary-glow)]",
        variant === "secondary" &&
          "border border-border bg-surface-2 text-foreground hover:border-primary/40",
        variant === "ghost" && "text-primary hover:underline",
        variant === "danger" && "border border-danger text-danger hover:bg-danger/10",
        className
      )}
    />
  );
}
