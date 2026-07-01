import type { Inspection, InspectionItem } from "@texo/shared";
import { INSPECTION_CATEGORIES } from "@texo/shared";
import { InspectionScore } from "@/components/ui/InspectionScore";

interface InspectionReportProps {
  inspection: Inspection;
  items: InspectionItem[];
}

/** Reporte de inspección con score e ítems por categoría. */
export function InspectionReport({ inspection, items }: InspectionReportProps) {
  const grouped = items.reduce<Record<string, InspectionItem[]>>((acc, item) => {
    const key = item.category;
    acc[key] = acc[key] ?? [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">
          Inspección certificada
        </h2>
        <InspectionScore score={inspection.score} />
      </div>
      <p className="mt-2 text-sm text-slate-500">
        Inspector: {inspection.inspector_name}
        {inspection.certified_at &&
          ` · ${new Date(inspection.certified_at).toLocaleDateString("es-MX")}`}
      </p>
      {inspection.notes && (
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          {inspection.notes}
        </p>
      )}

      <div className="mt-6 space-y-6">
        {Object.entries(grouped).map(([category, categoryItems]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {INSPECTION_CATEGORIES[category as keyof typeof INSPECTION_CATEGORIES] ??
                category}
            </h3>
            <ul className="mt-2 divide-y divide-slate-100">
              {categoryItems.map((item) => (
                <li key={item.id} className="py-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium text-slate-800">
                      {item.component}
                    </span>
                    <span className="capitalize text-slate-500">
                      {item.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-600">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-slate-500">Sin observaciones registradas.</p>
        )}
      </div>
    </section>
  );
}
