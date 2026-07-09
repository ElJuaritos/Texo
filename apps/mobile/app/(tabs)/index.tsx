import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  INSPECTION_MIN_PUBLISH_SCORE,
  listPublishedVehiclesForCatalog,
  type VehicleCatalogItem,
} from "@texo/shared";
import { EmptyState } from "../../components/ui/EmptyState";
import {
  FilterChips,
  SearchBar,
  type FilterChipId,
} from "../../components/ui/FilterChips";
import { LoadingState } from "../../components/ui/LoadingState";
import { VehicleCard } from "../../components/vehicles/VehicleCard";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../hooks/useFavorites";
import { applyChipFilter, searchCatalog } from "../../lib/catalog-filters";
import { colors, fontSize, fontWeight, spacing } from "../../lib/theme/tokens";

/** Home — catálogo con header limpio, safe area y grid 2 columnas. */
export default function HomeScreen() {
  const { client } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { favorites, toggleFavorite } = useFavorites();
  const [vehicles, setVehicles] = useState<VehicleCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState<FilterChipId>("all");

  const loadVehicles = useCallback(async () => {
    if (!client) return;
    try {
      setError(null);
      const data = await listPublishedVehiclesForCatalog(client);
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar inventario");
    }
  }, [client]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadVehicles();
      setLoading(false);
    })();
  }, [loadVehicles]);

  async function onRefresh() {
    setRefreshing(true);
    await loadVehicles();
    setRefreshing(false);
  }

  const filtered = useMemo(() => {
    let result = applyChipFilter(vehicles, activeChip);
    result = searchCatalog(result, search);
    return result;
  }, [vehicles, activeChip, search]);

  const certified = useMemo(
    () =>
      filtered.filter(
        (v) =>
          v.inspection_score != null &&
          v.inspection_score >= INSPECTION_MIN_PUBLISH_SCORE,
      ),
    [filtered],
  );

  const recommended = useMemo(
    () => filtered.filter((v) => !certified.some((c) => c.id === v.id)),
    [filtered, certified],
  );

  if (loading) return <LoadingState message="Cargando inventario…" />;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.brand}>TEXO</Text>
        <Text style={styles.tagline}>Autos certificados en México</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={refreshing}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.filters}>
          <SearchBar onChangeText={setSearch} value={search} />
          <FilterChips active={activeChip} onChange={setActiveChip} />
        </View>

        {error ? (
          <EmptyState description={error} title="No pudimos cargar el inventario" />
        ) : filtered.length === 0 ? (
          <EmptyState
            description="Prueba ajustando los filtros o vuelve más tarde."
            title="No hay vehículos"
          />
        ) : (
          <>
            {certified.length > 0 ? (
              <VehicleSection
                favorites={favorites}
                onPress={(id) => router.push(`/vehicle/${id}`)}
                onToggleFavorite={toggleFavorite}
                title="Certificados Texo"
                vehicles={certified}
              />
            ) : null}
            {recommended.length > 0 ? (
              <VehicleSection
                favorites={favorites}
                onPress={(id) => router.push(`/vehicle/${id}`)}
                onToggleFavorite={toggleFavorite}
                title="Recomendados"
                vehicles={recommended}
              />
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

interface VehicleSectionProps {
  title: string;
  vehicles: VehicleCatalogItem[];
  favorites: Set<string>;
  onPress: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

/** Grid 2 columnas para una sección del catálogo. */
function VehicleSection({
  title,
  vehicles,
  favorites,
  onPress,
  onToggleFavorite,
}: VehicleSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.grid}>
        {vehicles.map((vehicle) => (
          <View key={vehicle.id} style={styles.gridItem}>
            <VehicleCard
              isFavorite={favorites.has(vehicle.id)}
              onPress={() => onPress(vehicle.id)}
              onToggleFavorite={onToggleFavorite}
              vehicle={vehicle}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: 2,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.screen,
  },
  brand: {
    color: colors.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  tagline: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  scroll: {
    paddingBottom: spacing.xxl * 2,
  },
  filters: {
    gap: spacing.md,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    width: "50%",
  },
});
