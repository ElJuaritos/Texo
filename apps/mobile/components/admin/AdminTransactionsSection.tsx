import { Alert, StyleSheet, Text, View } from "react-native";
import type { Offer, Transaction, TransactionStatus } from "@texo/shared";
import { createTransaction, updateTransactionStatus } from "@texo/shared";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { StatusBadge } from "../ui/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { formatPrice } from "../../lib/format";
import { cardShadow, colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

const NEXT_STATUS: Record<TransactionStatus, TransactionStatus | null> = {
  initiated: "confirmed",
  confirmed: "closing",
  closing: "closed",
  closed: null,
};

interface AdminTransactionsSectionProps {
  transactions: Transaction[];
  acceptedOffers: Offer[];
  onUpdated: () => void;
}

/** Transacciones simuladas con avance de estados. */
export function AdminTransactionsSection({
  transactions,
  acceptedOffers,
  onUpdated,
}: AdminTransactionsSectionProps) {
  const { client } = useAuth();

  const offersWithoutTx = acceptedOffers.filter(
    (o) => !transactions.some((t) => t.offer_id === o.id),
  );

  async function handleCreateTransaction(offerId: string) {
    if (!client) return;
    try {
      await createTransaction(client, offerId);
      onUpdated();
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Error al crear");
    }
  }

  async function handleAdvance(transactionId: string, status: TransactionStatus) {
    if (!client) return;
    const next = NEXT_STATUS[status];
    if (!next) return;
    try {
      await updateTransactionStatus(client, transactionId, next);
      onUpdated();
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Error al avanzar");
    }
  }

  return (
    <View style={styles.wrap}>
      {offersWithoutTx.length > 0 ? (
        <View style={styles.block}>
          <Text style={styles.subtitle}>Ofertas aceptadas sin transacción</Text>
          {offersWithoutTx.map((offer) => (
            <View key={offer.id} style={styles.card}>
              <Text style={styles.cardTitle}>{formatPrice(offer.amount)}</Text>
              <Button
                label="Iniciar transacción"
                onPress={() => handleCreateTransaction(offer.id)}
              />
            </View>
          ))}
        </View>
      ) : null}

      {transactions.length === 0 ? (
        <EmptyState
          description="Las transacciones aparecerán tras iniciarlas desde ofertas aceptadas."
          title="Sin transacciones"
        />
      ) : (
        transactions.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.cardTitle}>Transacción</Text>
              <StatusBadge status={item.status} />
            </View>
            <Text style={styles.meta}>
              Creada: {new Date(item.created_at).toLocaleDateString("es-MX")}
            </Text>
            {NEXT_STATUS[item.status] ? (
              <Button
                label="Avanzar"
                onPress={() => handleAdvance(item.id, item.status)}
                style={styles.advanceBtn}
                variant="success"
              />
            ) : null}
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  block: {
    gap: spacing.md,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.lg,
    ...cardShadow,
  },
  cardRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  meta: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  advanceBtn: {
    marginTop: spacing.sm,
  },
});
