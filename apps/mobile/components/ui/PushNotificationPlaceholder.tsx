import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

/** Placeholder UI de push notifications — fuera del demo funcional. */
export function PushNotificationPlaceholder() {
  return (
    <View style={styles.container}>
      <Ionicons name="notifications-outline" color={colors.textMuted} size={20} />
      <View style={styles.textWrap}>
        <Text style={styles.title}>Notificaciones push</Text>
        <Text style={styles.description}>
          Próximamente — recibirás alertas de ofertas y citas aquí.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    backgroundColor: colors.slateBg,
    borderRadius: radius.md,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
  },
  textWrap: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.secondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  description: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    lineHeight: 16,
  },
});
