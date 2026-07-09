import {
  INSPECTION_MAX_SCORE,
  INSPECTION_MIN_PUBLISH_SCORE,
} from "@texo/shared";
import { cn } from "@/lib/cn";

interface InspectionScoreProps {
  score: number | null;
  variant?: "pill" | "overlay";
  showLabel?: boolean;
}

/** Badge de score de inspección (formato X/100). */
export function InspectionScore({
  score,
  variant = "pill",
  showLabel = true,
}: InspectionScoreProps) {
  if (score == null) {
    return (
      <span className="inline-flex rounded-full bg-texo-border/50 px-3 py-0.5 text-xs font-medium text-texo-text-muted">
        Sin inspección
      </span>
    );
  }

  let colors = "text-texo-error";
  let label = "No certificado";

  if (score >= INSPECTION_MIN_PUBLISH_SCORE) {
    colors = "text-texo-success";
    label = "Certificado";
  } else if (score >= 60) {
    colors = "text-texo-warning";
    label = "Revisar";
  }

  if (variant === "overlay") {
    return (
      <span
        className={cn(
          "rounded-full bg-black/60 px-2 py-1 text-xs font-bold backdrop-blur",
          colors,
        )}
      >
        {score}/{INSPECTION_MAX_SCORE}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-medium",
        score >= INSPECTION_MIN_PUBLISH_SCORE
          ? "bg-texo-success/10 text-texo-success"
          : score >= 60
            ? "bg-texo-warning/10 text-texo-warning"
            : "bg-texo-error/10 text-texo-error",
      )}
    >
      <span className="font-semibold">
        {score}/{INSPECTION_MAX_SCORE}
      </span>
      {showLabel && <> · {label}</>}
    </span>
  );
}

/** Score grande para ficha de vehículo. */
export function InspectionScoreLarge({ score }: { score: number | null }) {
  if (score == null) return null;

  let color = "text-texo-error";
  let label = "No certificado";

  if (score >= INSPECTION_MIN_PUBLISH_SCORE) {
    color = "text-texo-success";
    label = "Certificado";
  } else if (score >= 60) {
    color = "text-texo-warning";
    label = "Revisar";
  }

  return (
    <div className="flex items-baseline gap-2">
      <span className={cn("text-4xl font-bold", color)}>
        {score}/{INSPECTION_MAX_SCORE}
      </span>
      <span className={cn("text-sm font-medium", color)}>{label}</span>
    </div>
  );
}
