"use client";

import { useToast } from "@/components/ui/toast";

/** Copy to clipboard + toast confirmation (UIUX brief §7 motion spec). */
export function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const { toast } = useToast();

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        toast("Copied to clipboard", "success");
      }}
      className="h-[34px] rounded-full border border-border bg-surface-2 px-4 text-[13px] font-medium text-foreground transition-colors duration-150 hover:border-primary"
    >
      {label}
    </button>
  );
}
