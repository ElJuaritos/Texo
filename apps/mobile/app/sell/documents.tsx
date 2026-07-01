import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import {
  listSellerVehicles,
  STORAGE_BUCKETS,
  type Vehicle,
} from "@texo/shared";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingState } from "../../components/ui/LoadingState";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

/** Carga de INE y factura — paridad con web `/sell/documents`. */
export default function DocumentsScreen() {
  const { client, session } = useAuth();
  const { vehicleId } = useLocalSearchParams<{ vehicleId?: string }>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(vehicleId ?? null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  const loadVehicles = useCallback(async () => {
    if (!client || !session?.user.id) return;
    const data = await listSellerVehicles(client, session.user.id);
    setVehicles(data);
    return data;
  }, [client, session?.user.id]);

  useEffect(() => {
    if (vehicleId) setSelectedId(vehicleId);
  }, [vehicleId]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await loadVehicles();
      if (!vehicleId && data && data.length > 0) {
        setSelectedId(data[0]!.id);
      }
      setLoading(false);
    })();
  }, [loadVehicles, vehicleId]);

  async function uploadDocument(
    docType: "ine" | "invoice",
    label: string,
  ) {
    if (!client || !selectedId) {
      Alert.alert("Error", "Selecciona un vehículo");
      return;
    }

    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setUploading(docType);

    try {
      const path = `${selectedId}/${docType}/${Date.now()}-${asset.name}`;
      const response = await fetch(asset.uri);
      const blob = await response.blob();

      const { error: uploadError } = await client.storage
        .from(STORAGE_BUCKETS.transactionDocuments)
        .upload(path, blob, { contentType: asset.mimeType ?? "application/octet-stream" });

      if (uploadError) throw uploadError;

      const { error: dbError } = await client.from("vehicle_documents").insert({
        vehicle_id: selectedId,
        document_type: docType,
        storage_path: path,
      });

      if (dbError) throw dbError;

      await client
        .from("vehicles")
        .update({ status: "pending_inspection" })
        .eq("id", selectedId);

      Alert.alert("Listo", `${label} subido correctamente`);
      await loadVehicles();
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "No se pudo subir");
    } finally {
      setUploading(null);
    }
  }

  const selected = vehicles.find((v) => v.id === selectedId);

  if (loading) return <LoadingState message="Cargando vehículos…" />;

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.flex}>
      <Text style={styles.title}>Documentos del vendedor</Text>
      <Text style={styles.subtitle}>
        Sube INE y factura para continuar con la inspección certificada.
      </Text>

      {vehicles.length === 0 ? (
        <EmptyState
          description="Registra un vehículo en la pestaña Vender antes de subir documentos."
          title="Sin vehículos registrados"
        />
      ) : (
        <>
          <View style={styles.selector}>
            <Text style={styles.selectorLabel}>Vehículo</Text>
            {vehicles.map((v) => (
              <Button
                key={v.id}
                label={`${v.year} ${v.make} ${v.model}`}
                onPress={() => setSelectedId(v.id)}
                variant={selectedId === v.id ? "primary" : "outline"}
              />
            ))}
          </View>

          {selected ? (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  {selected.year} {selected.make} {selected.model}
                </Text>
                <StatusBadge status={selected.status} />
              </View>

              <Button
                label="Subir INE"
                loading={uploading === "ine"}
                onPress={() => uploadDocument("ine", "INE")}
              />
              <Button
                label="Subir factura"
                loading={uploading === "invoice"}
                onPress={() => uploadDocument("invoice", "Factura")}
                variant="outline"
              />
            </View>
          ) : null}
        </>
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
    color: colors.secondary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  selector: {
    gap: spacing.sm,
  },
  selectorLabel: {
    color: colors.secondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  cardHeader: {
    gap: spacing.sm,
  },
  cardTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
});
