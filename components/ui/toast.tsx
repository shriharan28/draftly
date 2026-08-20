"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { cn } from "@/lib/cn";

type ToastTone = "default" | "success" | "error";
type ToastItem = { id: number; message: string; tone: ToastTone };

const ToastContext = createContext<{
  toast: (message: string, tone?: ToastTone) => void;
} | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

/** Bottom-right toasts, 3s auto-dismiss (UIUX brief §5 Feedback). */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, tone: ToastTone = "default") => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, tone }]);
    setTimeout(
      () => setToasts((current) => current.filter((t) => t.id !== id)),
      3000
    );
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto rounded-[14px] border border-border bg-surface-2 px-4 py-3 text-sm text-foreground shadow-lg",
              t.tone === "success" && "border-success/40",
              t.tone === "error" && "border-danger/40"
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
