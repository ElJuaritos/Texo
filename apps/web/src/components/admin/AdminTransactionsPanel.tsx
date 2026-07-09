"use client";

import type { Offer, Transaction, TransactionStatus } from "@texo/shared";
import { createTransaction, updateTransactionStatus } from "@texo/shared";
import { getTexoBrowserClient } from "@/lib/supabase/texo-client";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

const NEXT_STATUS: Record<TransactionStatus, TransactionStatus | null> = {
  initiated: "confirmed",
  confirmed: "closing",
  closing: "closed",
  closed: null,
};

const STATUS_LABELS: Record<TransactionStatus, string> = {
  initiated: "Documentación en revisión",
  confirmed: "Documentación aprobada",
  closing: "Trámite en proceso",
  closed: "Proceso completado",
};

interface AdminTransactionsPanelProps {
  transactions: Transaction[];
  acceptedOffers: Offer[];
  onUpdated: () => void;
}

/** Transacciones simuladas y avance de estados documentales. */
export function AdminTransactionsPanel({
  transactions,
  acceptedOffers,
  onUpdated,
}: AdminTransactionsPanelProps) {
  async function handleCreateTransaction(offerId: string) {
    const client = getTexoBrowserClient();
    await createTransaction(client, offerId);
    onUpdated();
  }

  async function handleAdvance(transactionId: string, status: TransactionStatus) {
    const next = NEXT_STATUS[status];
    if (!next) return;
    const client = getTexoBrowserClient();
    await updateTransactionStatus(client, transactionId, next);
    onUpdated();
  }

  const offersWithoutTx = acceptedOffers.filter(
    (o) => !transactions.some((t) => t.offer_id === o.id),
  );

  return (
    <div className="space-y-6">
      {offersWithoutTx.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-texo-text-secondary">
            Ofertas aceptadas sin transacción
          </h3>
          {offersWithoutTx.map((offer) => (
            <div
              key={offer.id}
              className="flex flex-col gap-2 rounded-2xl border border-texo-border bg-texo-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm text-texo-text-primary">
                Oferta {offer.id.slice(0, 8)}… · $
                {offer.amount.toLocaleString("es-MX")} MXN
              </p>
              <Button
                onClick={() => handleCreateTransaction(offer.id)}
                className="px-4 py-2 text-sm"
              >
                Iniciar transacción
              </Button>
            </div>
          ))}
        </section>
      )}

      <section>
        <h3 className="mb-3 text-sm font-semibold text-texo-text-secondary">
          Transacciones activas
        </h3>
        {transactions.length === 0 ? (
          <EmptyState
            title="Sin transacciones"
            description="Crea una transacción desde una oferta aceptada."
          />
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col gap-3 rounded-2xl border border-texo-border bg-texo-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-mono text-xs text-texo-text-muted">
                    {tx.id.slice(0, 8)}…
                  </p>
                  <StatusBadge status={tx.status} />
                  <p className="mt-1 text-xs text-texo-text-secondary">
                    {STATUS_LABELS[tx.status]}
                  </p>
                </div>
                {NEXT_STATUS[tx.status] ? (
                  <Button
                    variant="secondary"
                    onClick={() => handleAdvance(tx.id, tx.status)}
                    className="px-4 py-2 text-xs"
                  >
                    Avanzar → {STATUS_LABELS[NEXT_STATUS[tx.status]!]}
                  </Button>
                ) : (
                  <span className="text-xs text-texo-text-muted">Completada</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
