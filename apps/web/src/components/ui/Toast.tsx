"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { cn } from "@/lib/cn";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: "border-texo-success/30 bg-texo-success/10 text-texo-success",
  error: "border-texo-error/30 bg-texo-error/10 text-texo-error",
  info: "border-texo-primary/30 bg-texo-primary-muted text-texo-text-primary",
};

/** Provider de notificaciones toast. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-20 left-4 right-4 z-50 flex flex-col gap-2 md:bottom-auto md:left-auto md:right-4 md:top-4 md:w-80"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto animate-slide-in rounded-xl border px-4 py-3 text-sm font-medium shadow-texo-card",
              VARIANT_STYLES[toast.variant],
            )}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Hook para mostrar toasts. */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
