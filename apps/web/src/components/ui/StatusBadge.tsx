import type { VehicleStatus, OfferStatus, TransactionStatus } from "@texo/shared";
import { VEHICLE_STATUSES, OFFER_STATUSES, TRANSACTION_STATUSES } from "@texo/shared";
import { cn } from "@/lib/cn";

type BadgeStatus = VehicleStatus | OfferStatus | TransactionStatus | "pending";

const STYLES: Record<string, string> = {
  published: "bg-texo-success/10 text-texo-success",
  pending: "bg-texo-warning/10 text-texo-warning",
  offer_accepted: "bg-texo-primary/10 text-texo-primary",
  sold: "bg-texo-border/50 text-texo-text-secondary",
  closed: "bg-texo-border/50 text-texo-text-secondary",
  inspection_failed: "bg-texo-error/10 text-texo-error",
  draft: "bg-texo-border/50 text-texo-text-muted",
  pending_documents: "bg-texo-warning/10 text-texo-warning",
  pending_inspection: "bg-texo-warning/10 text-texo-warning",
  withdrawn: "bg-texo-border/50 text-texo-text-muted",
  accepted: "bg-texo-success/10 text-texo-success",
  rejected: "bg-texo-error/10 text-texo-error",
  countered: "bg-texo-primary/10 text-texo-primary",
  expired: "bg-texo-border/50 text-texo-text-muted",
  initiated: "bg-texo-warning/10 text-texo-warning",
  confirmed: "bg-texo-primary/10 text-texo-primary",
  closing: "bg-texo-primary/10 text-texo-primary",
};

const LABELS: Record<string, string> = {
  ...VEHICLE_STATUSES,
  ...OFFER_STATUSES,
  ...TRANSACTION_STATUSES,
};

interface StatusBadgeProps {
  status: BadgeStatus;
  className?: string;
}

/** Pill de estado alineado al design system dark morado. */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = STYLES[status] ?? "bg-texo-border/50 text-texo-text-secondary";
  const label = LABELS[status] ?? status;

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-0.5 text-xs font-medium",
        style,
        className,
      )}
    >
      {label}
    </span>
  );
}
