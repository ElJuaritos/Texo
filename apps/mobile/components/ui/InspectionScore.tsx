import { StyleSheet, Text, View } from "react-native";
import {
  INSPECTION_MAX_SCORE,
  INSPECTION_MIN_PUBLISH_SCORE,
} from "@texo/shared";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

interface InspectionScoreProps {
  score: number | null;
  variant?: "pill" | "overlay";
}

function getPalette(score: number) {
  if (score >= INSPECTION_MIN_PUBLISH_SCORE) {
    return { bg: colors.successBg, text: colors.success, label: "Certificado" };
  }
  if (score >= 60) {
    return { bg: colors.warningBg, text: colors.warning, label: "Revisar" };
  }
  return { bg: colors.errorBg, text: colors.error, label: "No certificado" };
}

/** Badge de score — variant overlay para cards, pill para listados. */
export function InspectionScore({ score, variant = "pill" }: InspectionScoreProps) {
  if (score == null) {
    return (
      <View style={[styles.badge, styles.pill, { backgroundColor: colors.surfaceElevated }]}>
        <Text style={[styles.label, { color: colors.textMuted }]}>Sin inspección</Text>
      </View>
    );
  }

  const palette = getPalette(score);

  if (variant === "overlay") {
    return (
      <View style={[styles.badge, styles.overlay]}>
        <Text style={[styles.scoreOverlay, { color: palette.text }]}>
          {score}/{INSPECTION_MAX_SCORE}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.badge, styles.pill, { backgroundColor: palette.bg }]}>
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
    flexDirection: "row",
    gap: spacing.xs,
  },
  pill: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  overlay: {
    backgroundColor: colors.scoreBadgeBg,
    borderColor: colors.primary,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  score: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  scoreOverlay: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
});
