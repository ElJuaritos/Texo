"use client";

import { useState } from "react";
import type { Vehicle } from "@texo/shared";
import {
  INSPECTION_MIN_PUBLISH_SCORE,
  createInspection,
  publishVehicle,
} from "@texo/shared";
import { getTexoBrowserClient } from "@/lib/supabase/texo-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";

interface AdminInspectionQueueProps {
  vehicles: Vehicle[];
  onUpdated: () => void;
}

/** Cola de inspección y publicación — admin. */
export function AdminInspectionQueue({
  vehicles,
  onUpdated,
}: AdminInspectionQueueProps) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleInspectAndPublish(vehicle: Vehicle) {
    const score = scores[vehicle.id] ?? 85;
    const listingPrice =
      prices[vehicle.id] ??
      vehicle.listing_price ??
      vehicle.estimated_price ??
      450000;

    if (score < INSPECTION_MIN_PUBLISH_SCORE) {
      setError(`Score mínimo: ${INSPECTION_MIN_PUBLISH_SCORE}`);
      return;
    }

    setLoadingId(vehicle.id);
    setError(null);

    try {
      const client = getTexoBrowserClient();
      await createInspection(client, {
        vehicle_id: vehicle.id,
        inspector_name: "Texo / Taller Polanco",
        score,
        notes: "Inspección demo certificada.",
        items: [
          {
            category: "mechanical",
            component: "Motor",
            severity: "low",
            description: "Operación normal en frío y caliente.",
          },
          {
            category: "exterior",
            component: "Carrocería",
            severity: "low",
            description: "Sin daños estructurales.",
          },
        ],
      });
      await publishVehicle(client, vehicle.id, listingPrice);
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en inspección");
    } finally {
      setLoadingId(null);
    }
  }

  if (vehicles.length === 0) {
    return (
      <EmptyState
        title="Sin vehículos en inspección"
        description="Los autos con documentos enviados aparecerán aquí."
      />
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-texo-error">{error}</p>}
      {vehicles.map((vehicle) => (
        <article
          key={vehicle.id}
          className="rounded-2xl border border-texo-border bg-texo-surface p-4"
        >
          <p className="font-semibold text-texo-text-primary">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </p>
          <p className="text-xs text-texo-text-secondary">
            {vehicle.mileage.toLocaleString("es-MX")} km · ID{" "}
            {vehicle.id.slice(0, 8)}…
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Input
              label="Score inspección"
              type="number"
              min={0}
              max={100}
              value={scores[vehicle.id] ?? 85}
              onChange={(e) =>
                setScores((s) => ({
                  ...s,
                  [vehicle.id]: Number(e.target.value),
                }))
              }
            />
            <Input
              label="Precio publicación (MXN)"
              type="number"
              min={1}
              value={
                prices[vehicle.id] ??
                vehicle.listing_price ??
                vehicle.estimated_price ??
                450000
              }
              onChange={(e) =>
                setPrices((p) => ({
                  ...p,
                  [vehicle.id]: Number(e.target.value),
                }))
              }
            />
          </div>
          <Button
            disabled={loadingId === vehicle.id}
            onClick={() => handleInspectAndPublish(vehicle)}
            className="mt-3 px-4 py-2 text-sm"
          >
            {loadingId === vehicle.id
              ? "Procesando…"
              : "Inspeccionar y publicar"}
          </Button>
        </article>
      ))}
    </div>
  );
}
