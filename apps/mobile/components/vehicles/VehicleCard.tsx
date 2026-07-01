import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Vehicle, VehicleCatalogItem } from "@texo/shared";
import { resolveVehiclePrice } from "@texo/shared";
import { formatMileage, formatPrice } from "../../lib/format";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";
import { InspectionScore } from "../ui/InspectionScore";
import { StatusBadge } from "../ui/StatusBadge";

interface VehicleCardProps {
  vehicle: Vehicle | VehicleCatalogItem;
  onPress?: () => void;
  showStatus?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

function getInspectionScore(vehicle: Vehicle | VehicleCatalogItem): number | null {
  if ("inspection_score" in vehicle) {
    return vehicle.inspection_score;
  }
  return null;
}

/** Tarjeta de vehículo — paridad visual con web según design-tokens v1. */
export function VehicleCard({
  vehicle,
  onPress,
  showStatus = false,
  isFavorite,
  onToggleFavorite,
}: VehicleCardProps) {
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const price = resolveVehiclePrice(
    vehicle.listing_price,
    vehicle.estimated_price,
  );
  const inspectionScore = getInspectionScore(vehicle);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.photo}>
        <Ionicons name="car-sport-outline" color={colors.textMuted} size={48} />
        {onToggleFavorite ? (
          <Pressable
            accessibilityLabel={isFavorite ? "Quitar favorito" : "Agregar favorito"}
            onPress={() => onToggleFavorite(vehicle.id)}
            style={styles.favoriteBtn}
          >
            <Text style={isFavorite ? styles.favoriteOn : styles.favoriteOff}>
              {isFavorite ? "♥" : "♡"}
            </Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>
          {formatMileage(vehicle.mileage)} km
          {vehicle.trim ? ` · ${vehicle.trim}` : ""}
        </Text>
        <Text style={styles.price}>{formatPrice(price)}</Text>

        <View style={styles.badges}>
          <InspectionScore score={inspectionScore} />
          {showStatus ? <StatusBadge status={vehicle.status} /> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.92,
  },
  photo: {
    alignItems: "center",
    aspectRatio: 16 / 9,
    backgroundColor: colors.slateBg,
    justifyContent: "center",
  },
  favoriteBtn: {
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    padding: spacing.sm,
    position: "absolute",
    right: spacing.sm,
    top: spacing.sm,
  },
  favoriteOn: {
    color: colors.error,
    fontSize: fontSize.lg,
  },
  favoriteOff: {
    color: colors.textMuted,
    fontSize: fontSize.lg,
  },
  body: {
    gap: spacing.xs,
    padding: spacing.lg,
  },
  title: {
    color: colors.secondary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  meta: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  price: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    marginTop: spacing.xs,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
