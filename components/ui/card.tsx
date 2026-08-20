import { cn } from "@/lib/cn";

/** Card — radius 20px, surface bg, hairline border (UIUX brief §5). */
export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn("rounded-[20px] border border-border bg-surface p-6", className)}
    />
  );
}
