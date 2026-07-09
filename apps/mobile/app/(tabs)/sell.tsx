import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { listSellerVehicles, type Vehicle } from "@texo/shared";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingState } from "../../components/ui/LoadingState";
import { SellStepper } from "../../components/ui/SellStepper";
import { TextField } from "../../components/ui/TextField";
import { VehicleCard } from "../../components/vehicles/VehicleCard";
import { useAuth } from "../../hooks/useAuth";
import { estimatePriceRange, formatPrice } from "../../lib/format";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

interface SellForm {
  make: string;
  model: string;
  year: string;
  trim: string;
  mileage: string;
}

const emptyForm: SellForm = {
  make: "",
  model: "",
  year: "",
  trim: "",
  mileage: "",
};

/** Paso 1 del flujo vendedor — datos del vehículo. */
export default function SellScreen() {
  const { client, session } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<SellForm>(emptyForm);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadMyVehicles = useCallback(async () => {
    if (!client || !session?.user.id) return;
    const data = await listSellerVehicles(client, session.user.id);
    setVehicles(data);
  }, [client, session?.user.id]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadMyVehicles();
      setLoading(false);
    })();
  }, [loadMyVehicles]);

  function updateField(key: keyof SellForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const yearNum = Number(form.year);
  const mileageNum = Number(form.mileage);
  const estimate =
    yearNum > 1980 && mileageNum >= 0
      ? estimatePriceRange(yearNum, mileageNum)
      : null;

  async function handleSubmit() {
    if (!client || !session?.user.id) return;

    if (!form.make || !form.model || !form.year || !form.mileage) {
      Alert.alert("Error", "Completa marca, modelo, año y kilometraje");
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await client
        .from("vehicles")
        .insert({
          seller_id: session.user.id,
          make: form.make.trim(),
          model: form.model.trim(),
          year: yearNum,
          trim: form.trim.trim() || null,
          mileage: mileageNum,
          estimated_price: estimate ? (estimate.min + estimate.max) / 2 : null,
          status: "draft",
        })
        .select("id")
        .single();

      if (error) throw error;

      setForm(emptyForm);
      await loadMyVehicles();
      router.push({ pathname: "/sell/documents", params: { vehicleId: data.id } });
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState message="Cargando tus vehículos…" />;

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.flex}>
      <Text style={styles.title}>Publicar mi auto</Text>
      <SellStepper currentStep={1} />

      <View style={styles.form}>
        <TextField
          label="Marca"
          onChangeText={(v) => updateField("make", v)}
          placeholder="Ej. Toyota"
          value={form.make}
        />
        <TextField
          label="Modelo"
          onChangeText={(v) => updateField("model", v)}
          placeholder="Ej. Corolla"
          value={form.model}
        />
        <TextField
          keyboardType="numeric"
          label="Año"
          onChangeText={(v) => updateField("year", v)}
          placeholder="2020"
          value={form.year}
        />
        <TextField
          keyboardType="numeric"
          label="Kilómetros"
          onChangeText={(v) => updateField("mileage", v)}
          placeholder="45000"
          value={form.mileage}
        />
        <TextField
          label="Versión (trim)"
          onChangeText={(v) => updateField("trim", v)}
          placeholder="Ej. LE CVT (opcional)"
          value={form.trim}
        />

        {estimate ? (
          <View style={styles.estimateBox}>
            <Text style={styles.estimateLabel}>Rango estimado de mercado</Text>
            <Text style={styles.estimateValue}>
              {formatPrice(estimate.min)} – {formatPrice(estimate.max)}
            </Text>
            <Text style={styles.estimateNote}>
              Comisión Texo ~5% al vender. Estimación demo, sujeta a inspección.
            </Text>
          </View>
        ) : null}

        <Button
          fullWidth
          label="Siguiente"
          loading={submitting}
          onPress={handleSubmit}
        />
      </View>

      {vehicles.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Mis vehículos</Text>
          <FlatList
            contentContainerStyle={styles.list}
            data={vehicles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <VehicleCard
                onPress={() =>
                  router.push({
                    pathname: "/sell/documents",
                    params: { vehicleId: item.id },
                  })
                }
                showStatus
                vehicle={item}
              />
            )}
            scrollEnabled={false}
          />
        </>
      ) : (
        <EmptyState
          description="Completa el formulario para registrar tu primer auto."
          title="Aún no tienes vehículos"
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    backgroundColor: colors.background,
    flex: 1,
  },
  container: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  form: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  estimateBox: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    gap: spacing.xs,
    padding: spacing.md,
  },
  estimateLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  estimateValue: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  estimateNote: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    lineHeight: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  list: {
    gap: spacing.md,
  },
});
