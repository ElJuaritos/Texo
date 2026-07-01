import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  getVehicleWithInspection,
  resolveVehiclePrice,
  type VehicleWithInspection,
} from "@texo/shared";
import { BuyerActions } from "../../components/offers/BuyerActions";
import { InspectionReport } from "../../components/inspection/InspectionReport";
import { EmptyState } from "../../components/ui/EmptyState";
import { InspectionScore } from "../../components/ui/InspectionScore";
import { LoadingState } from "../../components/ui/LoadingState";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../hooks/useFavorites";
import { formatMileage, formatPrice } from "../../lib/format";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

/** Ficha de vehículo con inspección y oferta — paridad con web `/vehicles/[id]`. */
export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { client, session } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const [vehicle, setVehicle] = useState<VehicleWithInspection | null>(null);
  const [loading, setLoading] = useState(true);

  const loadVehicle = useCallback(async () => {
    if (!client || !id) return;
    const data = await getVehicleWithInspection(client, id);
    setVehicle(data?.status === "published" ? data : null);
  }, [client, id]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadVehicle();
      setLoading(false);
    })();
  }, [loadVehicle]);

  if (loading) return <LoadingState message="Cargando ficha…" />;

  if (!vehicle) {
    return (
      <EmptyState
        description="El vehículo no existe o ya no está disponible."
        title="No encontrado"
      />
    );
  }

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const price = resolveVehiclePrice(vehicle.listing_price, vehicle.estimated_price);
  const isFavorite = favorites.has(vehicle.id);

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.flex}>
      <View style={styles.hero}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>
          {formatMileage(vehicle.mileage)} km
          {vehicle.trim ? ` · ${vehicle.trim}` : ""}
        </Text>
        <Text style={styles.price}>{formatPrice(price)}</Text>
        <InspectionScore score={vehicle.inspection?.score ?? null} />
        <Text
          onPress={() => toggleFavorite(vehicle.id)}
          style={styles.favorite}
        >
          {isFavorite ? "♥ En favoritos" : "♡ Agregar a favoritos"}
        </Text>
      </View>

      {vehicle.inspection ? (
        <InspectionReport
          inspection={vehicle.inspection}
          items={vehicle.inspection_items}
        />
      ) : (
        <EmptyState
          description="Este vehículo aún no tiene reporte de inspección publicado."
          title="Sin inspección"
        />
      )}

      {client ? (
        <BuyerActions
          client={client}
          estimatedPrice={vehicle.estimated_price}
          isLoggedIn={!!session}
          listingPrice={vehicle.listing_price}
          vehicleId={vehicle.id}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    backgroundColor: colors.background,
    flex: 1,
  },
  container: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  hero: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  title: {
    color: colors.secondary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  meta: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  price: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    marginVertical: spacing.xs,
  },
  favorite: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
