import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "relative overflow-hidden rounded-[22px] border border-border bg-surface/80 p-6 backdrop-blur-xl transition-all duration-200 ease-out",
        "hover:border-primary/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      {children}
    </div>
  );
}
