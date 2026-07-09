import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Vehicle, VehicleCatalogItem } from "@texo/shared";
import { INSPECTION_MIN_PUBLISH_SCORE, resolveVehiclePrice } from "@texo/shared";
import { formatMileage, formatPrice } from "../../lib/format";
import { getVehicleImageUrl } from "../../lib/vehicle-image";
import {
  cardShadow,
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from "../../lib/theme/tokens";
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

/** Tarjeta de vehículo — minimalista con foto real o placeholder elegante. */
export function VehicleCard({
  vehicle,
  onPress,
  showStatus = false,
  isFavorite,
  onToggleFavorite,
}: VehicleCardProps) {
  const title = `${vehicle.make} ${vehicle.model}`;
  const price = resolveVehiclePrice(vehicle.listing_price, vehicle.estimated_price);
  const inspectionScore = getInspectionScore(vehicle);
  const isCertified =
    inspectionScore != null && inspectionScore >= INSPECTION_MIN_PUBLISH_SCORE;
  const imageUrl = getVehicleImageUrl(vehicle.cover_image_url);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.photo}>
        {imageUrl ? (
          <Image
            contentFit="cover"
            source={{ uri: imageUrl }}
            style={styles.photoImage}
            transition={200}
          />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons color={colors.textMuted} name="car-sport-outline" size={36} />
          </View>
        )}
        {isCertified ? (
          <View style={styles.certBadge}>
            <Text style={styles.certText}>CERTIFICADO</Text>
          </View>
        ) : null}
        {inspectionScore != null ? (
          <View style={styles.scoreWrap}>
            <InspectionScore score={inspectionScore} variant="overlay" />
          </View>
        ) : null}
        {onToggleFavorite ? (
          <Pressable
            accessibilityLabel={isFavorite ? "Quitar favorito" : "Agregar favorito"}
            hitSlop={8}
            onPress={(e) => {
              e.stopPropagation?.();
              onToggleFavorite(vehicle.id);
            }}
            style={styles.favoriteBtn}
          >
            <Ionicons
              color={isFavorite ? colors.error : colors.textPrimary}
              name={isFavorite ? "heart" : "heart-outline"}
              size={18}
            />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text style={styles.meta}>
          {vehicle.year} · {formatMileage(vehicle.mileage)} km
        </Text>
        <Text style={styles.price}>{formatPrice(price)}</Text>
        {showStatus ? (
          <View style={styles.badges}>
            <StatusBadge status={vehicle.status} />
          </View>
        ) : null}
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
    flex: 1,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...cardShadow,
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.985 }],
  },
  photo: {
    aspectRatio: 4 / 3,
    backgroundColor: colors.surfaceElevated,
    overflow: "hidden",
    position: "relative",
  },
  photoImage: {
    height: "100%",
    width: "100%",
  },
  photoPlaceholder: {
    alignItems: "center",
    backgroundColor: colors.surfaceElevated,
    flex: 1,
    justifyContent: "center",
  },
  certBadge: {
    backgroundColor: "rgba(124,58,237,0.92)",
    borderRadius: radius.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    position: "absolute",
    top: spacing.sm,
  },
  certText: {
    color: colors.textPrimary,
    fontSize: 9,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
  },
  scoreWrap: {
    position: "absolute",
    right: spacing.sm,
    top: spacing.sm,
  },
  favoriteBtn: {
    alignItems: "center",
    backgroundColor: "rgba(11,15,25,0.75)",
    borderRadius: radius.full,
    bottom: spacing.sm,
    height: 32,
    justifyContent: "center",
    position: "absolute",
    right: spacing.sm,
    width: 32,
  },
  body: {
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  meta: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },
  price: {
    color: colors.primary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    marginTop: 2,
  },
  badges: {
    marginTop: spacing.sm,
  },
});
