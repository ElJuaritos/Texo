import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import type { Vehicle } from "@texo/shared";
import {
  createInspection,
  INSPECTION_MIN_PUBLISH_SCORE,
  publishVehicle,
} from "@texo/shared";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { useAuth } from "../../hooks/useAuth";
import { formatPrice } from "../../lib/format";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

interface AdminInspectionSectionProps {
  vehicles: Vehicle[];
  onUpdated: () => void;
}

/** Cola de inspección — publicar vehículos pending_inspection. */
export function AdminInspectionSection({
  vehicles,
  onUpdated,
}: AdminInspectionSectionProps) {
  const { client } = useAuth();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, string>>({});

  async function handlePublish(vehicle: Vehicle) {
    if (!client) return;

    const score = Number(scores[vehicle.id] ?? "85");
    if (Number.isNaN(score) || score < INSPECTION_MIN_PUBLISH_SCORE) {
      Alert.alert("Error", `Score mínimo: ${INSPECTION_MIN_PUBLISH_SCORE}`);
      return;
    }

    const listingPrice =
      vehicle.listing_price ?? vehicle.estimated_price ?? 450000;

    setLoadingId(vehicle.id);
    try {
      await createInspection(client, {
        vehicle_id: vehicle.id,
        inspector_name: "Texo / Taller Polanco",
        score,
        notes: "Inspección demo certificada.",
        items: [
          {
            category: "mechanical",
            component: "Motor",
            severity: "low",
            description: "Operación normal.",
          },
          {
            category: "exterior",
            component: "Carrocería",
            severity: "low",
            description: "Sin daños estructurales.",
          },
        ],
      });
      await publishVehicle(client, vehicle.id, listingPrice);
      onUpdated();
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Error en inspección");
    } finally {
      setLoadingId(null);
    }
  }

  if (vehicles.length === 0) {
    return (
      <EmptyState
        description="Los vehículos con documentos enviados aparecerán aquí."
        title="Sin vehículos en inspección"
      />
    );
  }

  return (
    <View style={styles.list}>
      {vehicles.map((vehicle) => (
        <View key={vehicle.id} style={styles.card}>
          <Text style={styles.title}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Text>
          <Text style={styles.price}>
            {formatPrice(vehicle.listing_price ?? vehicle.estimated_price)}
          </Text>
          <Text style={styles.label}>Score de inspección</Text>
          <TextInput
            keyboardType="number-pad"
            onChangeText={(v) =>
              setScores((prev) => ({ ...prev, [vehicle.id]: v }))
            }
            placeholder={`${INSPECTION_MIN_PUBLISH_SCORE}`}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={scores[vehicle.id] ?? "85"}
          />
          <Button
            disabled={loadingId === vehicle.id}
            label={loadingId === vehicle.id ? "Publicando…" : "Inspeccionar y publicar"}
            loading={loadingId === vehicle.id}
            onPress={() => handlePublish(vehicle)}
          />
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
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  price: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  label: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: fontSize.base,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
