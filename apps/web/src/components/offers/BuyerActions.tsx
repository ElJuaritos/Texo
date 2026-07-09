"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createOffer, listBuyerOffers, scheduleTestDrive } from "@texo/shared";
import type { Offer } from "@texo/shared";
import { getTexoBrowserClient } from "@/lib/supabase/texo-client";
import { formatPriceMxn } from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { InfoBanner } from "@/components/ui/InfoBanner";
import { useToast } from "@/components/ui/Toast";

interface OfferModalProps {
  open: boolean;
  onClose: () => void;
  vehicleId: string;
  listingPrice: number | null;
  onSuccess: () => void;
}

/** Modal/sheet para enviar oferta. */
function OfferModal({
  open,
  onClose,
  vehicleId,
  listingPrice,
  onSuccess,
}: OfferModalProps) {
  const { showToast } = useToast();
  const [amount, setAmount] = useState(listingPrice ?? 400000);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setAmount(listingPrice ?? 400000);
  }, [open, listingPrice]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const client = getTexoBrowserClient();
      await createOffer(client, {
        vehicle_id: vehicleId,
        amount,
        message: message || undefined,
      });
      showToast("Oferta enviada, Texo la revisará pronto", "success");
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar oferta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md animate-slide-in rounded-t-2xl border border-texo-border bg-texo-surface p-6 md:rounded-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-texo-text-primary">Tu oferta</h2>
            {listingPrice && (
              <p className="mt-0.5 text-sm text-texo-text-muted">
                Precio publicado: {formatPriceMxn(listingPrice)}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="rounded-lg p-1 text-texo-text-muted hover:bg-texo-surface-elevated hover:text-texo-text-primary"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-texo-text-secondary">
              Monto (MXN)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-texo-text-muted">
                $
              </span>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-texo-border bg-texo-surface py-3 pl-8 pr-4 text-texo-text-primary outline-none focus:border-texo-primary focus:ring-1 focus:ring-texo-primary"
              />
            </div>
          </div>
          <Textarea
            label="Mensaje para Texo (opcional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
          <InfoBanner>
            Texo revisará tu oferta. No es vinculante hasta después de la prueba de
            manejo.
          </InfoBanner>
          {error && <p className="text-sm text-texo-error">{error}</p>}
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Enviando…" : "Enviar oferta"}
          </Button>
        </form>
      </div>
    </div>
  );
}

interface BuyerActionsProps {
  vehicleId: string;
  listingPrice: number | null;
  modalOpen?: boolean;
  onModalOpenChange?: (open: boolean) => void;
  hidePrimaryCta?: boolean;
}

/** Oferta formal y agendamiento de prueba de manejo. */
export function BuyerActions({
  vehicleId,
  listingPrice,
  modalOpen: externalModalOpen,
  onModalOpenChange,
  hidePrimaryCta = false,
}: BuyerActionsProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [location, setLocation] = useState("Polanco, CDMX");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const modalOpen = externalModalOpen ?? internalModalOpen;
  const setModalOpen = onModalOpenChange ?? setInternalModalOpen;
  const { showToast } = useToast();

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
      showToast("Prueba de manejo agendada correctamente", "success");
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
      <Link href="/login">
        <Button fullWidth>Iniciar sesión para ofertar</Button>
      </Link>
    );
  }

  if (loggedIn === null) {
    return <p className="text-sm text-texo-text-muted">Cargando…</p>;
  }

  return (
    <>
      {offers.length > 0 && (
        <ul className="mb-4 space-y-2">
          {offers.map((o) => (
            <li
              key={o.id}
              className="flex items-center justify-between rounded-xl border border-texo-border bg-texo-surface px-4 py-3 text-sm"
            >
              <span className="font-medium">{formatPriceMxn(o.amount)}</span>
              <StatusBadge status={o.status} />
            </li>
          ))}
        </ul>
      )}

      {!acceptedOffer && !hasPendingOffer && !hidePrimaryCta && (
        <Button fullWidth onClick={() => setModalOpen(true)}>
          Me interesa
        </Button>
      )}

      {hasPendingOffer && !acceptedOffer && (
        <InfoBanner variant="warning">
          Tienes una oferta pendiente. Texo la revisará pronto.
        </InfoBanner>
      )}

      {acceptedOffer && (
        <form onSubmit={handleSchedule} className="space-y-3">
          <p className="text-sm text-texo-success">Oferta aceptada — agenda tu prueba.</p>
          <Input
            label="Fecha y hora"
            type="datetime-local"
            required
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
          <Input
            label="Ubicación"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button type="submit" fullWidth disabled={loading}>
            Agendar prueba de manejo
          </Button>
        </form>
      )}

      {success && <p className="mt-2 text-sm text-texo-success">{success}</p>}
      {error && <p className="mt-2 text-sm text-texo-error">{error}</p>}

      <OfferModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        vehicleId={vehicleId}
        listingPrice={listingPrice}
        onSuccess={loadOffers}
      />
    </>
  );
}
