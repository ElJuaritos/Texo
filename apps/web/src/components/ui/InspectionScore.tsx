import {
  INSPECTION_MAX_SCORE,
  INSPECTION_MIN_PUBLISH_SCORE,
} from "@texo/shared";

interface InspectionScoreProps {
  score: number | null;
}

/** Badge de score de inspección (formato X/100). */
export function InspectionScore({ score }: InspectionScoreProps) {
  if (score == null) {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-600">
        Sin inspección
      </span>
    );
  }

  let colors = "bg-red-100 text-red-800";
  let label = "No certificado";

  if (score >= INSPECTION_MIN_PUBLISH_SCORE) {
    colors = "bg-green-100 text-green-800";
    label = "Certificado";
  } else if (score >= 60) {
    colors = "bg-amber-100 text-amber-800";
    label = "Revisar";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-medium ${colors}`}
    >
      <span className="font-semibold">
        {score}/{INSPECTION_MAX_SCORE}
      </span>
      · {label}
    </span>
  );
}
