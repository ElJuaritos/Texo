"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createOffer, listBuyerOffers, scheduleTestDrive } from "@texo/shared";
import type { Offer } from "@texo/shared";
import { getTexoBrowserClient } from "@/lib/supabase/texo-client";
import { formatPriceMxn } from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface BuyerActionsProps {
  vehicleId: string;
  listingPrice: number | null;
}

/** Oferta formal y agendamiento de prueba de manejo. */
export function BuyerActions({ vehicleId, listingPrice }: BuyerActionsProps) {
  const [amount, setAmount] = useState(listingPrice ?? 400000);
  const [message, setMessage] = useState("");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [location, setLocation] = useState("Polanco, CDMX");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  async function loadOffers() {
    const client = getTexoBrowserClient();
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) {
      setLoggedIn(false);
      return;
    }
    setLoggedIn(true);
    const all = await listBuyerOffers(client, user.id);
    setOffers(all.filter((o) => o.vehicle_id === vehicleId));
  }

  useEffect(() => {
    loadOffers();
  }, [vehicleId]);

  async function handleOffer(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const client = getTexoBrowserClient();
      await createOffer(client, {
        vehicle_id: vehicleId,
        amount,
        message: message || undefined,
      });
      setSuccess("Oferta enviada. El vendedor o admin la revisará.");
      await loadOffers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar oferta");
    } finally {
      setLoading(false);
    }
  }

  async function handleSchedule(e: React.FormEvent) {
    e.preventDefault();
    const acceptedOffer = offers.find((o) => o.status === "accepted");
    if (!acceptedOffer) return;

    setLoading(true);
    setError(null);
    try {
      const client = getTexoBrowserClient();
      await scheduleTestDrive(client, {
        offer_id: acceptedOffer.id,
        scheduled_at: new Date(scheduledAt).toISOString(),
        location,
      });
      setSuccess("Prueba de manejo agendada correctamente.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al agendar");
    } finally {
      setLoading(false);
    }
  }

  const acceptedOffer = offers.find((o) => o.status === "accepted");
  const hasPendingOffer = offers.some((o) => o.status === "pending");

  if (loggedIn === false) {
    return (
      <p className="text-sm text-slate-500">
        <Link href="/login" className="font-medium text-teal-700">
          Inicia sesión
        </Link>{" "}
        para enviar una oferta formal.
      </p>
    );
  }

  if (loggedIn === null) {
    return <p className="text-sm text-slate-400">Cargando…</p>;
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Oferta formal</h2>

      {offers.length > 0 && (
        <ul className="mt-3 space-y-2">
          {offers.map((o) => (
            <li key={o.id} className="flex items-center justify-between text-sm">
              <span>{formatPriceMxn(o.amount)}</span>
              <StatusBadge status={o.status} />
            </li>
          ))}
        </ul>
      )}

      {!acceptedOffer && !hasPendingOffer && (
        <form onSubmit={handleOffer} className="mt-4 space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Tu oferta (MXN)</span>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Mensaje (opcional)</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 disabled:opacity-50"
          >
            Enviar oferta
          </button>
        </form>
      )}

      {hasPendingOffer && !acceptedOffer && (
        <p className="mt-4 text-sm text-amber-700">
          Tienes una oferta pendiente. Un admin debe aceptarla para agendar la prueba de manejo.
        </p>
      )}

      {acceptedOffer && (
        <form onSubmit={handleSchedule} className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          <p className="text-sm text-green-700">Oferta aceptada — agenda tu prueba de manejo.</p>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Fecha y hora</span>
            <input
              type="datetime-local"
              required
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Ubicación</span>
            <input
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600"
          >
            Agendar prueba de manejo
          </button>
        </form>
      )}

      {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </section>
  );
}
