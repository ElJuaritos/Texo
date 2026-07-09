import { StyleSheet, Text, View } from "react-native";
import { colors, fontSize, radius, spacing } from "../../lib/theme/tokens";

interface InfoBannerProps {
  message: string;
}

/** Banner informativo con fondo morado muted. */
export function InfoBanner({ message }: InfoBannerProps) {
  return (
    <View style={styles.banner}>
      <Text style={styles.icon}>ℹ️</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: "flex-start",
    backgroundColor: colors.primaryMuted,
    borderColor: "rgba(124,58,237,0.3)",
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md,
  },
  icon: {
    fontSize: fontSize.base,
  },
  message: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
});
