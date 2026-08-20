import { cn } from "@/lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

/** Filled input — 48px tall, primary ring on focus, never color-only. */
export function Input({ label, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <label htmlFor={inputId} className="block">
      {label && <span className="mb-2 block text-sm text-muted">{label}</span>}
      <input
        id={inputId}
        {...props}
        className={cn(
          "h-12 w-full rounded-[14px] border border-border bg-surface-2 px-4 text-foreground",
          "placeholder:text-muted/70 transition-colors duration-150",
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
          className
        )}
      />
    </label>
  );
}
