import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, fontSize, fontWeight, spacing } from "../../lib/theme/tokens";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

/** Placeholder vacío con icono muted sobre fondo dark. */
export function EmptyState({
  title,
  description,
  icon = "car-outline",
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons color={colors.textMuted} name={icon} size={48} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.background,
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl * 2,
  },
  icon: {
    marginBottom: spacing.sm,
    opacity: 0.3,
  },
  title: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    textAlign: "center",
  },
  description: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 20,
    textAlign: "center",
  },
});
