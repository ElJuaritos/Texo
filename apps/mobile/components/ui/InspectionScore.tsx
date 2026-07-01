import { StyleSheet, Text, View } from "react-native";
import {
  INSPECTION_MAX_SCORE,
  INSPECTION_MIN_PUBLISH_SCORE,
} from "@texo/shared";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

interface InspectionScoreProps {
  score: number | null;
}

/** Badge de score de inspección con color y label según design-tokens. */
export function InspectionScore({ score }: InspectionScoreProps) {
  if (score == null) {
    return (
      <View style={[styles.badge, { backgroundColor: colors.slateBg }]}>
        <Text style={[styles.label, { color: colors.slateText }]}>
          Sin inspección
        </Text>
      </View>
    );
  }

  const palette =
    score >= INSPECTION_MIN_PUBLISH_SCORE
      ? { bg: colors.successBg, text: colors.success, label: "Certificado" }
      : score >= 60
        ? { bg: colors.warningBg, text: colors.warning, label: "Revisar" }
        : { bg: colors.errorBg, text: colors.error, label: "No certificado" };

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <Text style={[styles.score, { color: palette.text }]}>
        {score}/{INSPECTION_MAX_SCORE}
      </Text>
      <Text style={[styles.label, { color: palette.text }]}>{palette.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    borderRadius: radius.md,
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  score: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
});
