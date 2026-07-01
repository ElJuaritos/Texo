import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { listAdminTransactions, type Transaction } from "@texo/shared";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingState } from "../../components/ui/LoadingState";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

/** Panel de transacciones — paridad con web `/admin`. */
export default function AdminScreen() {
  const { client } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    if (!client) return;
    try {
      setError(null);
      const data = await listAdminTransactions(client);
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar transacciones");
    }
  }, [client]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadTransactions();
      setLoading(false);
    })();
  }, [loadTransactions]);

  async function onRefresh() {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  }

  if (loading) return <LoadingState message="Cargando panel…" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transacciones</Text>
        <Text style={styles.subtitle}>
          Seguimiento documental demo — escrow simulado
        </Text>
      </View>

      {error ? (
        <EmptyState description={error} title="Acceso denegado o error" />
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={transactions}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <EmptyState
              description="Las transacciones aparecerán cuando haya ofertas aceptadas."
              title="Sin transacciones"
            />
          }
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Transacción</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text style={styles.cardMeta}>Vehículo: {item.vehicle_id.slice(0, 8)}…</Text>
              <Text style={styles.cardMeta}>
                Creada: {new Date(item.created_at).toLocaleDateString("es-MX")}
              </Text>
              {item.closed_at ? (
                <Text style={styles.cardMeta}>
                  Cerrada: {new Date(item.closed_at).toLocaleDateString("es-MX")}
                </Text>
              ) : null}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    gap: spacing.xs,
    padding: spacing.lg,
  },
  title: {
    color: colors.secondary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  list: {
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.lg,
  },
  cardRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLabel: {
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  cardMeta: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
