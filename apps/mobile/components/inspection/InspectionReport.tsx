import { StyleSheet, Text, View } from "react-native";
import type { Inspection, InspectionItem } from "@texo/shared";
import { INSPECTION_CATEGORIES } from "@texo/shared";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";
import { InspectionScore } from "../ui/InspectionScore";

interface InspectionReportProps {
  inspection: Inspection;
  items: InspectionItem[];
}

/** Reporte de inspección agrupado por categoría — paridad con ficha web. */
export function InspectionReport({ inspection, items }: InspectionReportProps) {
  const grouped = items.reduce<Record<string, InspectionItem[]>>((acc, item) => {
    const key = item.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reporte de inspección</Text>
        <InspectionScore score={inspection.score} />
      </View>

      <Text style={styles.inspector}>
        Inspector: {inspection.inspector_name}
      </Text>
      {inspection.notes ? (
        <Text style={styles.notes}>{inspection.notes}</Text>
      ) : null}

      {Object.entries(grouped).map(([category, categoryItems]) => (
        <View key={category} style={styles.section}>
          <Text style={styles.sectionTitle}>
            {INSPECTION_CATEGORIES[category as keyof typeof INSPECTION_CATEGORIES]}
          </Text>
          {categoryItems.map((item) => (
            <View key={item.id} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.component}>{item.component}</Text>
                <Text style={[styles.severity, severityColor(item.severity)]}>
                  {item.severity}
                </Text>
              </View>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

function severityColor(severity: string) {
  switch (severity) {
    case "critical":
      return { color: colors.error };
    case "high":
      return { color: colors.warning };
    case "medium":
      return { color: colors.info };
    default:
      return { color: colors.textMuted };
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    color: colors.secondary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
  },
  inspector: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  notes: {
    color: colors.text,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  section: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    color: colors.secondary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  item: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    gap: spacing.xs,
    padding: spacing.md,
  },
  itemHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  component: {
    color: colors.text,
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  severity: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: "uppercase",
  },
  description: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
});
