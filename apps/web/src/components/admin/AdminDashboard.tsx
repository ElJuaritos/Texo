"use client";

import { useCallback, useEffect, useState } from "react";
import type { Offer, Transaction, Vehicle } from "@texo/shared";
import {
  listPendingOffers,
  listVehiclesPendingInspection,
  listAdminTransactions,
} from "@texo/shared";
import { getTexoBrowserClient } from "@/lib/supabase/texo-client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorState } from "@/components/ui/ErrorState";
import { AdminOffersQueue } from "./AdminOffersQueue";
import { AdminInspectionQueue } from "./AdminInspectionQueue";
import { AdminTransactionsPanel } from "./AdminTransactionsPanel";

/** Panel admin operativo — moderación, inspección y transacciones demo. */
export function AdminDashboard() {
  const [pendingOffers, setPendingOffers] = useState<Offer[]>([]);
  const [pendingVehicles, setPendingVehicles] = useState<Vehicle[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [acceptedOffers, setAcceptedOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const client = getTexoBrowserClient();
      const [offers, vehicles, txs] = await Promise.all([
        listPendingOffers(client),
        listVehiclesPendingInspection(client),
        listAdminTransactions(client),
      ]);

      const { data: accepted, error: acceptedError } = await client
        .from("offers")
        .select("*")
        .eq("status", "accepted")
        .order("created_at", { ascending: false });

      if (acceptedError) throw acceptedError;

      setPendingOffers(offers);
      setPendingVehicles(vehicles);
      setTransactions(txs);
      setAcceptedOffers(accepted ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar panel");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return <LoadingSpinner label="Cargando panel admin…" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-10">
      <section id="offers">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-texo-text-primary">
          Ofertas pendientes
          {pendingOffers.length > 0 && (
            <span className="rounded-full bg-texo-primary px-2 py-0.5 text-xs font-medium text-white">
              {pendingOffers.length}
            </span>
          )}
        </h2>
        <AdminOffersQueue offers={pendingOffers} onUpdated={loadData} />
      </section>

      <section id="inspection">
        <h2 className="mb-4 text-lg font-semibold text-texo-text-primary">
          Inspección y publicación
        </h2>
        <AdminInspectionQueue vehicles={pendingVehicles} onUpdated={loadData} />
      </section>

      <section id="transactions">
        <h2 className="mb-4 text-lg font-semibold text-texo-text-primary">
          Transacciones (escrow simulado)
        </h2>
        <AdminTransactionsPanel
          transactions={transactions}
          acceptedOffers={acceptedOffers}
          onUpdated={loadData}
        />
      </section>
    </div>
  );
}
