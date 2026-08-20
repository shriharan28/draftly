import { cn } from "@/lib/cn";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export function Textarea({ label, className, id, ...props }: TextareaProps) {
  const areaId = id ?? props.name;
  return (
    <label htmlFor={areaId} className="block">
      {label && <span className="mb-2 block text-sm text-muted">{label}</span>}
      <textarea
        id={areaId}
        {...props}
        className={cn(
          "w-full rounded-[14px] border border-border bg-surface-2 px-4 py-3 text-foreground",
          "placeholder:text-muted/70 transition-colors duration-150",
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
          className
        )}
      />
    </label>
  );
}
