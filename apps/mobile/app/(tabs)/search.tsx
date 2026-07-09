import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  listPublishedVehiclesForCatalog,
  type VehicleCatalogItem,
} from "@texo/shared";
import { EmptyState } from "../../components/ui/EmptyState";
import { SearchBar } from "../../components/ui/FilterChips";
import { LoadingState } from "../../components/ui/LoadingState";
import { VehicleCard } from "../../components/vehicles/VehicleCard";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../hooks/useFavorites";
import { searchCatalog } from "../../lib/catalog-filters";
import { colors, fontSize, fontWeight, spacing } from "../../lib/theme/tokens";

/** Pantalla de búsqueda dedicada con grid 2 columnas. */
export default function SearchScreen() {
  const { client } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { favorites, toggleFavorite } = useFavorites();
  const [vehicles, setVehicles] = useState<VehicleCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const loadVehicles = useCallback(async () => {
    if (!client) return;
    const data = await listPublishedVehiclesForCatalog(client);
    setVehicles(data);
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

  const filtered = useMemo(
    () => searchCatalog(vehicles, search),
    [vehicles, search],
  );

  if (loading) return <LoadingState message="Cargando…" />;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.title}>Buscar</Text>
        <SearchBar
          autoFocus
          onChangeText={setSearch}
          placeholder="Marca, modelo, año..."
          value={search}
        />
        <Text style={styles.count}>
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <EmptyState
            description="Prueba con otra marca o modelo."
            icon="search-outline"
            title="Sin resultados"
          />
        }
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={refreshing}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <VehicleCard
            isFavorite={favorites.has(item.id)}
            onPress={() => router.push(`/vehicle/${item.id}`)}
            onToggleFavorite={toggleFavorite}
            vehicle={item}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    gap: spacing.md,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.screen,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  count: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  list: {
    paddingBottom: spacing.xl * 2,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
  },
  row: {
    justifyContent: "space-between",
  },
});
