import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import {
  createOffer,
  listBuyerOffers,
  resolveVehiclePrice,
  scheduleTestDrive,
  type Offer,
} from "@texo/shared";
import { Button } from "../ui/Button";
import { StatusBadge } from "../ui/StatusBadge";
import { TextField } from "../ui/TextField";
import { formatPrice } from "../../lib/format";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";
import type { TexoSupabaseClient } from "@texo/shared";

interface BuyerActionsProps {
  client: TexoSupabaseClient;
  vehicleId: string;
  listingPrice: number | null;
  estimatedPrice: number | null;
  isLoggedIn: boolean;
}

/** Oferta formal y test drive — paridad con web BuyerActions. */
export function BuyerActions({
  client,
  vehicleId,
  listingPrice,
  estimatedPrice,
  isLoggedIn,
}: BuyerActionsProps) {
  const defaultPrice = resolveVehiclePrice(listingPrice, estimatedPrice) ?? 400000;
  const [amount, setAmount] = useState(String(defaultPrice));
  const [message, setMessage] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [location, setLocation] = useState("Polanco, CDMX");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadOffers() {
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) return;
    const all = await listBuyerOffers(client, user.id);
    setOffers(all.filter((o) => o.vehicle_id === vehicleId));
  }

  useEffect(() => {
    if (isLoggedIn) loadOffers();
  }, [vehicleId, isLoggedIn]);

  async function handleOffer() {
    setLoading(true);
    try {
      await createOffer(client, {
        vehicle_id: vehicleId,
        amount: Number(amount),
        message: message.trim() || undefined,
      });
      Alert.alert("Oferta enviada", "El vendedor o admin la revisará.");
      await loadOffers();
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "No se pudo enviar");
    } finally {
      setLoading(false);
    }
  }

  async function handleSchedule() {
    const accepted = offers.find((o) => o.status === "accepted");
    if (!accepted) return;

    setLoading(true);
    try {
      await scheduleTestDrive(client, {
        offer_id: accepted.id,
        scheduled_at: new Date(scheduledAt).toISOString(),
        location,
      });
      Alert.alert("Listo", "Prueba de manejo agendada correctamente.");
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "No se pudo agendar");
    } finally {
      setLoading(false);
    }
  }

  const acceptedOffer = offers.find((o) => o.status === "accepted");
  const hasPending = offers.some((o) => o.status === "pending");

  if (!isLoggedIn) {
    return (
      <Text style={styles.hint}>
        Inicia sesión como comprador para enviar una oferta formal.
      </Text>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Oferta formal</Text>

      {offers.length > 0 ? (
        <View style={styles.offerList}>
          {offers.map((o) => (
            <View key={o.id} style={styles.offerRow}>
              <Text style={styles.offerAmount}>{formatPrice(o.amount)}</Text>
              <StatusBadge status={o.status} />
            </View>
          ))}
        </View>
      ) : null}

      {!acceptedOffer && !hasPending ? (
        <>
          <TextField
            keyboardType="numeric"
            label="Tu oferta (MXN)"
            onChangeText={setAmount}
            value={amount}
          />
          <TextField
            label="Mensaje (opcional)"
            onChangeText={setMessage}
            value={message}
          />
          <Button label="Enviar oferta" loading={loading} onPress={handleOffer} />
        </>
      ) : null}

      {hasPending && !acceptedOffer ? (
        <Text style={styles.pending}>
          Oferta pendiente — un admin debe aceptarla para agendar la prueba de manejo.
        </Text>
      ) : null}

      {acceptedOffer ? (
        <>
          <Text style={styles.accepted}>
            Oferta aceptada — agenda tu prueba de manejo.
          </Text>
          <TextField
            label="Fecha y hora (ISO o texto)"
            onChangeText={setScheduledAt}
            placeholder="2026-07-01T10:00"
            value={scheduledAt}
          />
          <TextField label="Ubicación" onChangeText={setLocation} value={location} />
          <Button label="Agendar prueba de manejo" loading={loading} onPress={handleSchedule} />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  hint: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  offerList: {
    gap: spacing.sm,
  },
  offerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  offerAmount: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
  },
  pending: {
    color: colors.warning,
    fontSize: fontSize.sm,
  },
  accepted: {
    color: colors.success,
    fontSize: fontSize.sm,
  },
});
