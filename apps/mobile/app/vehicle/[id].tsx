import { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getVehicleWithInspection,
  INSPECTION_MIN_PUBLISH_SCORE,
  resolveVehiclePrice,
  type VehicleWithInspection,
} from "@texo/shared";
import { BuyerActions } from "../../components/offers/BuyerActions";
import { InspectionReport } from "../../components/inspection/InspectionReport";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { InfoBanner } from "../../components/ui/InfoBanner";
import { LoadingState } from "../../components/ui/LoadingState";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../hooks/useFavorites";
import { formatMileage, formatPrice } from "../../lib/format";
import { getVehicleImageUrl } from "../../lib/vehicle-image";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

const TRUST_CHECKS = [
  "Historial verificado",
  "Documentos verificados",
  "Sin adeudos",
];

/** Ficha de vehículo con foto hero, reporte y CTAs fijos. */
export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { client, session } = useAuth();
  const insets = useSafeAreaInsets();
  const { favorites, toggleFavorite } = useFavorites();
  const [vehicle, setVehicle] = useState<VehicleWithInspection | null>(null);
  const [loading, setLoading] = useState(true);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

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
  const isCertified =
    vehicle.inspection != null &&
    vehicle.inspection.score >= INSPECTION_MIN_PUBLISH_SCORE;
  const imageUrl = getVehicleImageUrl(vehicle.cover_image_url);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        style={styles.flex}
      >
        <View style={styles.hero}>
          {imageUrl ? (
            <Image
              contentFit="cover"
              source={{ uri: imageUrl }}
              style={styles.heroImage}
              transition={200}
            />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Ionicons color={colors.textMuted} name="car-sport-outline" size={56} />
            </View>
          )}
          {isCertified ? (
            <View style={styles.certBadge}>
              <Text style={styles.certText}>CERTIFICADO TEXO</Text>
            </View>
          ) : null}
          <Pressable
            accessibilityLabel="Favorito"
            onPress={() => toggleFavorite(vehicle.id)}
            style={styles.favoriteBtn}
          >
            <Ionicons
              color={isFavorite ? colors.error : colors.textPrimary}
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
            />
          </Pressable>
        </View>

        <Text style={styles.price}>{formatPrice(price)}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>
          {formatMileage(vehicle.mileage)} km
          {vehicle.trim ? ` · ${vehicle.trim}` : ""}
        </Text>

        <View style={styles.checks}>
          {TRUST_CHECKS.map((check) => (
            <View key={check} style={styles.checkRow}>
              <Ionicons color={colors.success} name="checkmark-circle" size={16} />
              <Text style={styles.checkItem}>{check}</Text>
            </View>
          ))}
        </View>

        <InfoBanner message="Texo verifica cada auto antes de publicarlo. No contactes al vendedor directamente." />

        {vehicle.inspection ? (
          <View nativeID="inspection-report">
            <Text style={styles.reportTitle}>Reporte de inspección</Text>
            <InspectionReport
              inspection={vehicle.inspection}
              items={vehicle.inspection_items}
            />
          </View>
        ) : (
          <EmptyState
            description="Este vehículo aún no tiene reporte de inspección publicado."
            title="Sin inspección"
          />
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          label="Ver reporte"
          onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}
          style={styles.bottomBtn}
          variant="outline"
        />
        <Button
          label="Me interesa"
          onPress={() => setOfferModalOpen(true)}
          style={styles.bottomBtn}
        />
      </View>

      <Modal
        animationType="slide"
        onRequestClose={() => setOfferModalOpen(false)}
        transparent
        visible={offerModalOpen}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + spacing.lg }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Me interesa</Text>
              <Pressable hitSlop={12} onPress={() => setOfferModalOpen(false)}>
                <Ionicons color={colors.textSecondary} name="close" size={24} />
              </Pressable>
            </View>
            {client ? (
              <BuyerActions
                client={client}
                estimatedPrice={vehicle.estimated_price}
                isLoggedIn={!!session}
                listingPrice={vehicle.listing_price}
                vehicleId={vehicle.id}
              />
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  container: {
    gap: spacing.lg,
    padding: spacing.screen,
    paddingBottom: 120,
  },
  hero: {
    aspectRatio: 16 / 10,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  heroImage: {
    height: "100%",
    width: "100%",
  },
  heroPlaceholder: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  certBadge: {
    backgroundColor: "rgba(124,58,237,0.92)",
    borderRadius: radius.full,
    left: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    position: "absolute",
    top: spacing.md,
  },
  certText: {
    color: colors.textPrimary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  favoriteBtn: {
    alignItems: "center",
    backgroundColor: "rgba(11,15,25,0.75)",
    borderRadius: radius.full,
    bottom: spacing.md,
    height: 40,
    justifyContent: "center",
    position: "absolute",
    right: spacing.md,
    width: 40,
  },
  price: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: fontWeight.bold,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  meta: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  checks: {
    gap: spacing.sm,
  },
  checkRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  checkItem: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  reportTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  bottomBar: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: "row",
    gap: spacing.sm,
    left: 0,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    position: "absolute",
    right: 0,
  },
  bottomBtn: {
    flex: 1,
  },
  modalOverlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    flex: 1,
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    maxHeight: "80%",
    padding: spacing.lg,
  },
  modalHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
});
