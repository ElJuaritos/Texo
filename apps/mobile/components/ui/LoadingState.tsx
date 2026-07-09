import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, fontSize, spacing } from "../../lib/theme/tokens";

/** Indicador de carga centrado para pantallas async. */
export function LoadingState({ message = "Cargando…" }: { message?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    gap: spacing.md,
    justifyContent: "center",
    padding: spacing.xl,
  },
  message: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
