import type { VehicleStatus, OfferStatus, TransactionStatus } from "@texo/shared";
import { VEHICLE_STATUSES, OFFER_STATUSES, TRANSACTION_STATUSES } from "@texo/shared";

type BadgeStatus = VehicleStatus | OfferStatus | TransactionStatus | "pending";

const STYLES: Record<string, string> = {
  published: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  offer_accepted: "bg-blue-100 text-blue-800",
  sold: "bg-slate-100 text-slate-800",
  closed: "bg-slate-100 text-slate-800",
  inspection_failed: "bg-red-100 text-red-800",
  draft: "bg-slate-100 text-slate-600",
  pending_documents: "bg-amber-100 text-amber-800",
  pending_inspection: "bg-amber-100 text-amber-800",
  withdrawn: "bg-slate-100 text-slate-600",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  countered: "bg-blue-100 text-blue-800",
  expired: "bg-slate-100 text-slate-600",
  initiated: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  closing: "bg-blue-100 text-blue-800",
};

const LABELS: Record<string, string> = {
  ...VEHICLE_STATUSES,
  ...OFFER_STATUSES,
  ...TRANSACTION_STATUSES,
};

interface StatusBadgeProps {
  status: BadgeStatus;
}

/** Pill de estado alineado a design-tokens v1. */
export function StatusBadge({ status }: StatusBadgeProps) {
  const style = STYLES[status] ?? "bg-slate-100 text-slate-700";
  const label = LABELS[status] ?? status;

  return (
    <span
      className={`inline-flex rounded-full px-3 py-0.5 text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
}
