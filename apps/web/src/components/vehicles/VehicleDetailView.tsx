"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { VehicleWithInspection } from "@texo/shared";
import { InspectionReport } from "@/components/vehicles/InspectionReport";
import { VehicleDetailActions } from "@/components/vehicles/VehicleDetailActions";
import { BuyerActions } from "@/components/offers/BuyerActions";
import { InspectionScoreLarge } from "@/components/ui/InspectionScore";
import { InfoBanner } from "@/components/ui/InfoBanner";
import { formatMileage, formatPriceMxn } from "@/lib/format";
import { getVehicleImageUrl } from "@/lib/vehicle-image";
import { useFavorites } from "@/hooks/useFavorites";

interface VehicleDetailViewProps {
  vehicle: VehicleWithInspection;
}

const TRUST_CHECKS = [
  "Historial verificado",
  "Documentos verificados",
  "Sin adeudos",
];

/** Vista completa de ficha de vehículo. */
export function VehicleDetailView({ vehicle }: VehicleDetailViewProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.has(vehicle.id);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const price = vehicle.listing_price ?? vehicle.estimated_price;
  const isCertified =
    vehicle.inspection != null && vehicle.inspection.score >= 75;
  const imageUrl = getVehicleImageUrl(vehicle.cover_image_url);

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <Link
        href="/"
        className="inline-flex text-sm font-medium text-texo-primary hover:underline"
      >
        ← Volver al inventario
      </Link>

      <div className="relative overflow-hidden rounded-2xl">
        <div className="relative aspect-[16/10] bg-texo-surface-elevated">
          {imageUrl ? (
            <Image
              alt={title}
              className="object-cover"
              fill
              priority
              sizes="100vw"
              src={imageUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-texo-text-muted">
              <svg className="h-16 w-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 17h8M5 11l1.5-4h11L19 11M5 11v6h14v-6" />
              </svg>
            </div>
          )}
        </div>

        <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur">
          1/1
        </span>

        {isCertified && (
          <span className="absolute left-3 top-3 rounded-full bg-texo-primary/90 px-3 py-1 text-xs font-medium text-white">
            CERTIFICADO TEXO
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleFavorite(vehicle.id)}
          className="absolute bottom-3 right-3 rounded-full bg-black/60 p-2.5 backdrop-blur"
          aria-label="Favorito"
        >
          <span className={isFavorite ? "text-texo-error" : "text-white"}>
            {isFavorite ? "♥" : "♡"}
          </span>
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <header className="space-y-2">
            <p className="text-3xl font-bold text-texo-text-primary">
              {formatPriceMxn(price)}
            </p>
            <h1 className="text-xl font-semibold text-texo-text-primary">{title}</h1>
            <p className="text-sm text-texo-text-secondary">
              {formatMileage(vehicle.mileage)} km
              {vehicle.trim ? ` · ${vehicle.trim}` : ""}
            </p>

            <ul className="flex flex-wrap gap-4 pt-2">
              {TRUST_CHECKS.map((check) => (
                <li key={check} className="flex items-center gap-1.5 text-sm text-texo-success">
                  <span>✓</span> {check}
                </li>
              ))}
            </ul>
          </header>

          <InfoBanner>
            Texo verifica cada auto antes de publicarlo. No contactes al vendedor
            directamente.
          </InfoBanner>

          {vehicle.inspection ? (
            <div id="inspection-report">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-texo-text-primary">
                  Reporte de inspección
                </h2>
                <InspectionScoreLarge score={vehicle.inspection.score} />
              </div>
              <InspectionReport
                inspection={vehicle.inspection}
                items={vehicle.inspection_items}
              />
            </div>
          ) : (
            <p className="rounded-2xl border border-texo-border bg-texo-surface p-6 text-sm text-texo-text-muted">
              Inspección pendiente de publicación.
            </p>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-8 rounded-2xl border border-texo-border bg-texo-surface p-6">
            <VehicleDetailActions
              vehicle={vehicle}
              offerModalOpen={offerModalOpen}
              onOfferModalOpenChange={setOfferModalOpen}
            />
          </div>
        </aside>
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-texo-border bg-texo-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex gap-3">
          <a
            href="#inspection-report"
            className="flex-1 rounded-full border border-texo-border py-3 text-center text-sm font-semibold text-texo-text-primary"
          >
            Ver reporte
          </a>
          <button
            type="button"
            onClick={() => setOfferModalOpen(true)}
            className="flex-1 rounded-full bg-texo-primary py-3 text-sm font-semibold text-white active:scale-95"
          >
            Me interesa
          </button>
        </div>
      </div>

      <div className="lg:hidden">
        <BuyerActions
          vehicleId={vehicle.id}
          listingPrice={price}
          modalOpen={offerModalOpen}
          onModalOpenChange={setOfferModalOpen}
          hidePrimaryCta
        />
      </div>
    </div>
  );
}
