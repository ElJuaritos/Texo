import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import {
  filterCatalogVehicles,
  getCatalogMakes,
  listPublishedVehiclesForCatalog,
  type VehicleCatalogItem,
} from "@texo/shared";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingState } from "../../components/ui/LoadingState";
import { VehicleCard } from "../../components/vehicles/VehicleCard";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../hooks/useFavorites";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

/** Inventario con filtros y favoritos — paridad con web `/`. */
export default function BrowseScreen() {
  const { client } = useAuth();
  const router = useRouter();
  const { favorites, toggleFavorite } = useFavorites();
  const [vehicles, setVehicles] = useState<VehicleCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [make, setMake] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");

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

  const makes = useMemo(() => getCatalogMakes(vehicles), [vehicles]);

  const filtered = useMemo(
    () =>
      filterCatalogVehicles(
        vehicles,
        {
          make: make || undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          minYear: minYear ? Number(minYear) : undefined,
        },
        { favoriteIds: favorites, favoritesOnly: showFavoritesOnly },
      ),
    [vehicles, make, minPrice, maxPrice, minYear, favorites, showFavoritesOnly],
  );

  if (loading) return <LoadingState message="Cargando inventario…" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Seminuevos certificados</Text>
        <Pressable onPress={() => setShowFavoritesOnly((v) => !v)}>
          <Text style={styles.favToggle}>
            {showFavoritesOnly ? "Ver todos" : "Solo favoritos"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.filters}>
        <Text style={styles.filterLabel}>Marca</Text>
        <View style={styles.chips}>
          <Chip active={!make} label="Todas" onPress={() => setMake("")} />
          {makes.map((m) => (
            <Chip key={m} active={make === m} label={m} onPress={() => setMake(m)} />
          ))}
        </View>
        <View style={styles.row}>
          <FilterInput label="Precio mín." onChange={setMinPrice} value={minPrice} />
          <FilterInput label="Precio máx." onChange={setMaxPrice} value={maxPrice} />
        </View>
        <FilterInput label="Año desde" onChange={setMinYear} value={minYear} />
      </View>

      {error ? (
        <EmptyState description={error} title="No pudimos cargar el inventario" />
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={filtered}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <EmptyState
              description="Prueba ajustando los filtros o vuelve más tarde."
              title="No hay vehículos"
            />
          }
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
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
      )}
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

function FilterInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        keyboardType="numeric"
        onChangeText={onChange}
        style={styles.input}
        value={value}
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
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  title: {
    color: colors.secondary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  favToggle: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  filters: {
    gap: spacing.sm,
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  filterLabel: {
    color: colors.secondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  chipTextActive: {
    color: colors.surface,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  field: {
    flex: 1,
    gap: spacing.xs,
  },
  fieldLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: fontSize.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  list: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
});
