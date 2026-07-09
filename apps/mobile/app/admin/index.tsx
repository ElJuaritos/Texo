import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  listAdminTransactions,
  listPendingOffers,
  listVehiclesPendingInspection,
  type Offer,
  type Transaction,
  type Vehicle,
} from "@texo/shared";
import { AdminInspectionSection } from "../../components/admin/AdminInspectionSection";
import { AdminOffersSection } from "../../components/admin/AdminOffersSection";
import { AdminTransactionsSection } from "../../components/admin/AdminTransactionsSection";
import { LoadingState } from "../../components/ui/LoadingState";
import { useAuth } from "../../hooks/useAuth";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

type AdminTab = "offers" | "inspection" | "transactions";

const TABS: { id: AdminTab; label: string }[] = [
  { id: "offers", label: "Ofertas" },
  { id: "inspection", label: "Inspección" },
  { id: "transactions", label: "Transacciones" },
];

/** Panel admin con tabs — ofertas, inspección y transacciones. */
export default function AdminScreen() {
  const { client } = useAuth();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<AdminTab>("offers");
  const [pendingOffers, setPendingOffers] = useState<Offer[]>([]);
  const [pendingVehicles, setPendingVehicles] = useState<Vehicle[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [acceptedOffers, setAcceptedOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!client) return;
    try {
      setError(null);
      const [offers, vehicles, txs] = await Promise.all([
        listPendingOffers(client),
        listVehiclesPendingInspection(client),
        listAdminTransactions(client),
      ]);

      const { data: accepted, error: acceptedError } = await client
        .from("offers")
        .select("*")
        .eq("status", "accepted")
        .order("created_at", { ascending: false });

      if (acceptedError) throw acceptedError;

      setPendingOffers(offers);
      setPendingVehicles(vehicles);
      setTransactions(txs);
      setAcceptedOffers((accepted ?? []) as Offer[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar panel");
    }
  }, [client]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    })();
  }, [loadData]);

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  if (loading) return <LoadingState message="Cargando panel…" />;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.title}>Panel admin</Text>
        <Text style={styles.subtitle}>Moderación, inspección y transacciones</Text>
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.tabs}
        showsHorizontalScrollIndicator={false}
      >
        {TABS.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={refreshing}
            tintColor={colors.primary}
          />
        }
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {activeTab === "offers" ? (
          <AdminOffersSection offers={pendingOffers} onUpdated={loadData} />
        ) : null}
        {activeTab === "inspection" ? (
          <AdminInspectionSection onUpdated={loadData} vehicles={pendingVehicles} />
        ) : null}
        {activeTab === "transactions" ? (
          <AdminTransactionsSection
            acceptedOffers={acceptedOffers}
            onUpdated={loadData}
            transactions={transactions}
          />
        ) : null}
      </ScrollView>
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
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.screen,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  tabs: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.screen,
  },
  tab: {
    borderColor: colors.border,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  tabTextActive: {
    color: colors.textPrimary,
  },
  content: {
    gap: spacing.lg,
    padding: spacing.screen,
    paddingBottom: spacing.xxl * 2,
  },
  error: {
    color: colors.error,
    fontSize: fontSize.sm,
  },
});
