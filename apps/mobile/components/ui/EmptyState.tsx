import { StyleSheet, Text, View } from "react-native";
import { colors, fontSize, fontWeight, spacing } from "../../lib/theme/tokens";

interface EmptyStateProps {
  title: string;
  description?: string;
}

/** Placeholder cuando no hay datos en un listado. */
export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl * 2,
  },
  title: {
    color: colors.secondary,
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
