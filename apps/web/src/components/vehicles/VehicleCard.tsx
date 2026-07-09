import Link from "next/link";
import Image from "next/image";
import type { VehicleCatalogItem } from "@texo/shared";
import { resolveVehiclePrice } from "@texo/shared";
import { InspectionScore } from "@/components/ui/InspectionScore";
import { formatMileage, formatPriceMxn } from "@/lib/format";
import { getVehicleImageUrl } from "@/lib/vehicle-image";

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
  const title = `${vehicle.make} ${vehicle.model}`;
  const price = resolveVehiclePrice(
    vehicle.listing_price,
    vehicle.estimated_price,
  );
  const isCertified =
    vehicle.inspection_score != null && vehicle.inspection_score >= 75;
  const imageUrl = getVehicleImageUrl(vehicle.cover_image_url);

  return (
    <article className="group overflow-hidden rounded-2xl border border-texo-border bg-texo-surface shadow-texo-card transition hover:scale-[1.02] hover:border-texo-primary/50">
      <Link href={`/vehicles/${vehicle.id}`} className="block">
        <div className="relative aspect-[4/3] bg-texo-surface-elevated">
          {imageUrl ? (
            <Image
              alt={title}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              src={imageUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-texo-text-muted">
              <svg
                className="h-10 w-10 opacity-40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 17h8M5 11l1.5-4h11L19 11M5 11v6h14v-6M7 17a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zm7 0a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z"
                />
              </svg>
            </div>
          )}

          {isCertified && (
            <span className="absolute left-2 top-2 rounded-full bg-texo-primary/90 px-2 py-1 text-[10px] font-medium text-white">
              CERTIFICADO TEXO
            </span>
          )}

          {vehicle.inspection_score != null && (
            <span className="absolute right-2 top-2">
              <InspectionScore score={vehicle.inspection_score} variant="overlay" />
            </span>
          )}

          {onToggleFavorite && (
            <button
              type="button"
              aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(vehicle.id);
              }}
              className="absolute bottom-2 right-2 rounded-full bg-black/60 p-2 backdrop-blur transition hover:bg-black/80"
            >
              <span className={isFavorite ? "text-texo-error" : "text-white"}>
                {isFavorite ? "♥" : "♡"}
              </span>
            </button>
          )}
        </div>

        <div className="space-y-1 p-3">
          <h2 className="truncate text-sm font-semibold text-texo-text-primary">
            {title}
          </h2>
          <p className="text-xs text-texo-text-secondary">
            {vehicle.year} · {formatMileage(vehicle.mileage)} km
          </p>
          <p className="text-xl font-bold text-texo-primary">
            {formatPriceMxn(price)}
          </p>
        </div>
      </Link>
    </article>
  );
}

/** Grid de vehículos reutilizable. */
export function VehicleGrid({
  vehicles,
  favorites,
  onToggleFavorite,
}: {
  vehicles: VehicleCatalogItem[];
  favorites?: Set<string>;
  onToggleFavorite?: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          isFavorite={favorites?.has(vehicle.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
