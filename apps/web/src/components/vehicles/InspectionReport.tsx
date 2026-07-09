import type { Inspection, InspectionItem } from "@texo/shared";
import { INSPECTION_CATEGORIES } from "@texo/shared";
import { cn } from "@/lib/cn";

interface InspectionReportProps {
  inspection: Inspection;
  items: InspectionItem[];
}

const SEVERITY_COLORS: Record<string, string> = {
  low: "text-texo-success",
  medium: "text-texo-warning",
  high: "text-texo-error",
  critical: "text-texo-error",
};

/** Reporte de inspección con categorías expandibles. */
export function InspectionReport({ inspection, items }: InspectionReportProps) {
  const grouped = items.reduce<Record<string, InspectionItem[]>>((acc, item) => {
    const key = item.category;
    acc[key] = acc[key] ?? [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <section className="rounded-2xl border border-texo-border bg-texo-surface p-6">
      <p className="text-sm text-texo-text-secondary">
        Inspector: {inspection.inspector_name}
        {inspection.certified_at &&
          ` · ${new Date(inspection.certified_at).toLocaleDateString("es-MX")}`}
      </p>
      {inspection.notes && (
        <p className="mt-4 rounded-xl bg-texo-surface-elevated p-3 text-sm text-texo-text-secondary">
          {inspection.notes}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {Object.entries(grouped).map(([category, categoryItems]) => (
          <details
            key={category}
            className="group rounded-xl border border-texo-border bg-texo-surface-elevated"
            open
          >
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-texo-text-primary">
              {INSPECTION_CATEGORIES[category as keyof typeof INSPECTION_CATEGORIES] ??
                category}
            </summary>
            <ul className="divide-y divide-texo-border px-4">
              {categoryItems.map((item) => (
                <li key={item.id} className="py-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium text-texo-text-primary">
                      {item.component}
                    </span>
                    <span
                      className={cn(
                        "capitalize",
                        SEVERITY_COLORS[item.severity] ?? "text-texo-text-muted",
                      )}
                    >
                      {item.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-texo-text-secondary">{item.description}</p>
                </li>
              ))}
            </ul>
          </details>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-texo-text-muted">Sin observaciones registradas.</p>
        )}
      </div>
    </section>
  );
}
