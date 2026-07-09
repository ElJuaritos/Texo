import { cn } from "@/lib/cn";

interface InfoBannerProps {
  children: React.ReactNode;
  variant?: "info" | "warning";
  className?: string;
}

/** Banner informativo con estilo morado o ámbar. */
export function InfoBanner({
  children,
  variant = "info",
  className,
}: InfoBannerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-xl border px-4 py-3 text-sm",
        variant === "info" &&
          "border-texo-primary/30 bg-texo-primary-muted text-texo-text-primary",
        variant === "warning" &&
          "border-texo-warning/30 bg-texo-warning/10 text-texo-text-primary",
        className,
      )}
    >
      <span className="shrink-0 text-base" aria-hidden>
        {variant === "warning" ? "⏳" : "ℹ️"}
      </span>
      <p>{children}</p>
    </div>
  );
}
