import { StyleSheet, Text, View } from "react-native";
import type { VehicleStatus, OfferStatus, TransactionStatus, TestDriveStatus } from "@texo/shared";
import {
  OFFER_STATUSES,
  TEST_DRIVE_STATUSES,
  TRANSACTION_STATUSES,
  VEHICLE_STATUSES,
} from "@texo/shared";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

type BadgeStatus = VehicleStatus | OfferStatus | TransactionStatus | TestDriveStatus;

interface StatusBadgeProps {
  status: BadgeStatus;
}

/** Colores dark semitransparentes — paridad web v2. */
function getStatusColors(status: BadgeStatus) {
  switch (status) {
    case "published":
    case "accepted":
    case "confirmed":
      return { bg: colors.successBg, text: colors.success };
    case "pending":
    case "pending_documents":
    case "pending_inspection":
    case "initiated":
      return { bg: colors.warningBg, text: colors.warning };
    case "offer_accepted":
    case "countered":
    case "closing":
      return { bg: colors.infoBg, text: colors.primary };
    case "sold":
    case "closed":
    case "withdrawn":
      return { bg: "rgba(42,51,71,0.5)", text: colors.textSecondary };
    case "inspection_failed":
    case "rejected":
    case "expired":
    case "cancelled":
    case "no_show":
      return { bg: colors.errorBg, text: colors.error };
    default:
      return { bg: colors.surfaceElevated, text: colors.textMuted };
  }
}

function getStatusLabel(status: BadgeStatus): string {
  if (status in VEHICLE_STATUSES) {
    return VEHICLE_STATUSES[status as VehicleStatus];
  }
  if (status in OFFER_STATUSES) {
    return OFFER_STATUSES[status as OfferStatus];
  }
  if (status in TRANSACTION_STATUSES) {
    return TRANSACTION_STATUSES[status as TransactionStatus];
  }
  if (status in TEST_DRIVE_STATUSES) {
    return TEST_DRIVE_STATUSES[status as TestDriveStatus];
  }
  return status;
}

/** Pill de estado dark semitransparente. */
export function StatusBadge({ status }: StatusBadgeProps) {
  const palette = getStatusColors(status);

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <Text style={[styles.label, { color: palette.text }]}>
        {getStatusLabel(status)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
});
