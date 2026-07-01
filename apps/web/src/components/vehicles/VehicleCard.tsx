import Link from "next/link";
import type { VehicleCatalogItem } from "@texo/shared";
import { resolveVehiclePrice } from "@texo/shared";
import { InspectionScore } from "@/components/ui/InspectionScore";
import { formatMileage, formatPriceMxn } from "@/lib/format";

interface VehicleCardProps {
  vehicle: VehicleCatalogItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

/** Tarjeta de vehículo para el listado del marketplace. */
export function VehicleCard({
  vehicle,
  isFavorite,
  onToggleFavorite,
}: VehicleCardProps) {
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const price = resolveVehiclePrice(
    vehicle.listing_price,
    vehicle.estimated_price,
  );

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/vehicles/${vehicle.id}`} className="block">
        <div className="relative aspect-video bg-slate-100">
          <div className="flex h-full items-center justify-center text-slate-400">
            <svg
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7h8m-8 4h8m-6 4h4M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
              />
            </svg>
          </div>
          {onToggleFavorite && (
            <button
              type="button"
              aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(vehicle.id);
              }}
              className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow-sm hover:bg-white"
            >
              <span className={isFavorite ? "text-red-500" : "text-slate-400"}>
                {isFavorite ? "♥" : "♡"}
              </span>
            </button>
          )}
        </div>
        <div className="space-y-2 p-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">
            {formatMileage(vehicle.mileage)} km
            {vehicle.trim ? ` · ${vehicle.trim}` : ""}
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {formatPriceMxn(price)}
          </p>
          <InspectionScore score={vehicle.inspection_score} />
        </div>
      </Link>
    </article>
  );
}
