import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import type { Offer } from "@texo/shared";
import { acceptOffer, rejectOffer } from "@texo/shared";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { useAuth } from "../../hooks/useAuth";
import { formatPrice } from "../../lib/format";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

interface AdminOffersSectionProps {
  offers: Offer[];
  onUpdated: () => void;
}

/** Cola de ofertas pendientes — moderación admin. */
export function AdminOffersSection({ offers, onUpdated }: AdminOffersSectionProps) {
  const { client } = useAuth();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleAccept(offerId: string) {
    if (!client) return;
    setLoadingId(offerId);
    try {
      await acceptOffer(client, offerId);
      onUpdated();
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "No se pudo aceptar");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleReject(offerId: string) {
    if (!client) return;
    setLoadingId(offerId);
    try {
      await rejectOffer(client, offerId);
      onUpdated();
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "No se pudo rechazar");
    } finally {
      setLoadingId(null);
    }
  }

  if (offers.length === 0) {
    return (
      <EmptyState
        description="Las ofertas de compradores aparecerán aquí."
        title="Sin ofertas pendientes"
      />
    );
  }

  return (
    <View style={styles.list}>
      {offers.map((offer) => (
        <View key={offer.id} style={styles.card}>
          <Text style={styles.amount}>{formatPrice(offer.amount)}</Text>
          {offer.message ? (
            <Text numberOfLines={2} style={styles.message}>
              {offer.message}
            </Text>
          ) : null}
          <View style={styles.actions}>
            <Button
              disabled={loadingId === offer.id}
              label="Rechazar"
              onPress={() => handleReject(offer.id)}
              style={styles.btn}
              variant="outline"
            />
            <Button
              disabled={loadingId === offer.id}
              label="Aceptar"
              onPress={() => handleAccept(offer.id)}
              style={styles.btn}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  amount: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  message: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  btn: {
    flex: 1,
  },
});
