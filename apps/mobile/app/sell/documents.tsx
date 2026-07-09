import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import {
  listSellerVehicles,
  STORAGE_BUCKETS,
  type Vehicle,
} from "@texo/shared";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { InfoBanner } from "../../components/ui/InfoBanner";
import { LoadingState } from "../../components/ui/LoadingState";
import { SellStepper } from "../../components/ui/SellStepper";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

const CHECKLIST = [
  { key: "data", label: "Datos del vehículo", done: true },
  { key: "docs", label: "Documentos enviados", done: true },
  { key: "inspection", label: "Inspección programada", done: false },
  { key: "publish", label: "Publicación activa", done: false },
];

type PickedFile = DocumentPicker.DocumentPickerAsset;

/** Paso 2 documentos — validación de ambos archivos antes de enviar. */
export default function DocumentsScreen() {
  const { client, session } = useAuth();
  const router = useRouter();
  const { vehicleId } = useLocalSearchParams<{ vehicleId?: string }>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(vehicleId ?? null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ineFile, setIneFile] = useState<PickedFile | null>(null);
  const [invoiceFile, setInvoiceFile] = useState<PickedFile | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  async function pickDocument(setter: (file: PickedFile) => void) {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets[0]) return;
    setter(result.assets[0]);
    setError(null);
  }

  async function uploadFile(
    file: PickedFile,
    docType: "ine" | "invoice",
    targetId: string,
  ) {
    if (!client) throw new Error("Cliente no disponible");

    const path = `${targetId}/${docType}/${Date.now()}-${file.name}`;
    const response = await fetch(file.uri);
    const blob = await response.blob();

    const { error: uploadError } = await client.storage
      .from(STORAGE_BUCKETS.transactionDocuments)
      .upload(path, blob, {
        contentType: file.mimeType ?? "application/octet-stream",
      });

    if (uploadError) throw uploadError;

    const { error: dbError } = await client.from("vehicle_documents").insert({
      vehicle_id: targetId,
      document_type: docType,
      storage_path: path,
    });

    if (dbError) throw dbError;
  }

  async function handleSubmit() {
    if (!client || !selectedId) {
      setError("Selecciona un vehículo");
      return;
    }
    if (!ineFile || !invoiceFile) {
      setError("Sube INE y factura antes de enviar");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await uploadFile(ineFile, "ine", selectedId);
      await uploadFile(invoiceFile, "invoice", selectedId);

      const { error: statusError } = await client
        .from("vehicles")
        .update({ status: "pending_inspection" })
        .eq("id", selectedId);

      if (statusError) throw statusError;

      setSubmitted(true);
      await loadVehicles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar");
    } finally {
      setSubmitting(false);
    }
  }

  const selected = vehicles.find((v) => v.id === selectedId);

  if (loading) return <LoadingState message="Cargando vehículos…" />;

  if (submitted) {
    return (
      <ScrollView contentContainerStyle={styles.container} style={styles.flex}>
        <SellStepper currentStep={3} />
        <View style={styles.warningBanner}>
          <Text style={styles.warningTitle}>Esperando inspección</Text>
          <Text style={styles.warningDesc}>
            Texo coordinará la inspección de tu vehículo en los próximos 3–5 días hábiles.
          </Text>
        </View>
        <View style={styles.checklist}>
          {CHECKLIST.map((item) => (
            <View key={item.key} style={styles.checkRow}>
              <Ionicons
                color={item.done ? colors.success : colors.warning}
                name={item.done ? "checkmark-circle" : "time-outline"}
                size={20}
              />
              <Text
                style={[
                  styles.checkLabel,
                  item.done ? styles.checkLabelDone : styles.checkLabelPending,
                ]}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>
        <Button
          fullWidth
          label="Ir al inicio"
          onPress={() => router.replace("/(tabs)")}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.flex}>
      <Text style={styles.title}>Publicar mi auto</Text>
      <SellStepper currentStep={2} />

      {vehicles.length === 0 ? (
        <EmptyState
          description="Registra un vehículo en la pestaña Vender antes de subir documentos."
          title="Sin vehículos registrados"
        />
      ) : (
        <>
          {selected ? (
            <View style={styles.selectedCard}>
              <Text style={styles.selectedTitle}>
                {selected.year} {selected.make} {selected.model}
              </Text>
              <StatusBadge status={selected.status} />
            </View>
          ) : null}

          <UploadZone
            done={!!ineFile}
            fileName={ineFile?.name}
            label="Subir INE del propietario"
            onPress={() => pickDocument(setIneFile)}
          />
          <UploadZone
            done={!!invoiceFile}
            fileName={invoiceFile?.name}
            label="Subir factura del vehículo"
            onPress={() => pickDocument(setInvoiceFile)}
          />

          <InfoBanner message="Los documentos son revisados por Texo antes de la inspección." />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            <Button fullWidth label="Atrás" onPress={() => router.back()} variant="outline" />
            <Button
              disabled={!ineFile || !invoiceFile}
              fullWidth
              label={submitting ? "Enviando…" : "Enviar"}
              loading={submitting}
              onPress={handleSubmit}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
}

interface UploadZoneProps {
  label: string;
  onPress: () => void;
  done?: boolean;
  fileName?: string;
}

/** Zona de upload con feedback visual al seleccionar archivo. */
function UploadZone({ label, onPress, done, fileName }: UploadZoneProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.uploadZone, done && styles.uploadZoneDone]}
    >
      {done ? (
        <>
          <Ionicons color={colors.success} name="checkmark-circle" size={32} />
          <Text style={styles.uploadDone}>{fileName ?? "Archivo listo"}</Text>
        </>
      ) : (
        <>
          <Ionicons color={colors.primary} name="cloud-upload-outline" size={32} />
          <Text style={styles.uploadLabel}>{label}</Text>
          <Text style={styles.uploadHint}>PDF o JPG · máx. 10 MB</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    backgroundColor: colors.background,
    flex: 1,
  },
  container: {
    gap: spacing.lg,
    padding: spacing.screen,
    paddingBottom: spacing.xxl * 2,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  selectedCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  selectedTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  uploadZone: {
    alignItems: "center",
    borderColor: "rgba(124,58,237,0.5)",
    borderRadius: radius.lg,
    borderStyle: "dashed",
    borderWidth: 2,
    gap: spacing.sm,
    padding: spacing.xl,
  },
  uploadZoneDone: {
    backgroundColor: colors.successBg,
    borderColor: colors.success,
    borderStyle: "solid",
  },
  uploadLabel: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    textAlign: "center",
  },
  uploadDone: {
    color: colors.success,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    textAlign: "center",
  },
  uploadHint: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  error: {
    color: colors.error,
    fontSize: fontSize.sm,
  },
  actions: {
    gap: spacing.sm,
  },
  warningBanner: {
    backgroundColor: colors.warningBg,
    borderColor: "rgba(245,158,11,0.3)",
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.lg,
  },
  warningTitle: {
    color: colors.warning,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  warningDesc: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  checklist: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  checkRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  checkLabel: {
    fontSize: fontSize.sm,
  },
  checkLabelDone: {
    color: colors.textPrimary,
  },
  checkLabelPending: {
    color: colors.textMuted,
  },
});
