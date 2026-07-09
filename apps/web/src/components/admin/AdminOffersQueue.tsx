"use client";

import type { Offer } from "@texo/shared";
import { acceptOffer, rejectOffer } from "@texo/shared";
import { formatPriceMxn } from "@/lib/format";
import { getTexoBrowserClient } from "@/lib/supabase/texo-client";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

interface AdminOffersQueueProps {
  offers: Offer[];
  onUpdated: () => void;
}

/** Cola de ofertas pendientes — moderación admin. */
export function AdminOffersQueue({ offers, onUpdated }: AdminOffersQueueProps) {
  async function handleAccept(offerId: string) {
    const client = getTexoBrowserClient();
    await acceptOffer(client, offerId);
    onUpdated();
  }

  async function handleReject(offerId: string) {
    const client = getTexoBrowserClient();
    await rejectOffer(client, offerId);
    onUpdated();
  }

  if (offers.length === 0) {
    return (
      <EmptyState
        title="Sin ofertas pendientes"
        description="Las nuevas ofertas aparecerán aquí para revisión."
      />
    );
  }

  return (
    <div className="space-y-3">
      {offers.map((offer) => (
        <article
          key={offer.id}
          className="flex flex-col gap-3 rounded-2xl border border-texo-border bg-texo-surface p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-xl font-bold text-texo-text-primary">
              {formatPriceMxn(offer.amount)}
            </p>
            <p className="text-xs text-texo-text-secondary">
              Vehículo {offer.vehicle_id.slice(0, 8)}… ·{" "}
              {new Date(offer.created_at).toLocaleString("es-MX")}
            </p>
            {offer.message && (
              <p className="mt-1 text-sm italic text-texo-text-muted">
                {offer.message}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="success"
              className="px-4 py-2 text-sm"
              onClick={() => handleAccept(offer.id)}
            >
              Aceptar
            </Button>
            <Button
              variant="danger"
              className="px-4 py-2 text-sm"
              onClick={() => handleReject(offer.id)}
            >
              Rechazar
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
