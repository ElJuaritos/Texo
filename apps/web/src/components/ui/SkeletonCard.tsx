/** Skeleton para VehicleCard durante carga. */
export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-texo-border bg-texo-surface">
      <div className="aspect-[4/3] animate-pulse bg-texo-surface-elevated" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-texo-surface-elevated" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-texo-surface-elevated" />
        <div className="h-6 w-2/3 animate-pulse rounded bg-texo-surface-elevated" />
      </div>
    </div>
  );
}
