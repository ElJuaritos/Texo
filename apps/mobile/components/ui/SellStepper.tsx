import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

const STEPS = [
  { num: 1, label: "Datos" },
  { num: 2, label: "Documentos" },
  { num: 3, label: "Confirmación" },
];

interface SellStepperProps {
  currentStep: 1 | 2 | 3;
}

/** Stepper de 3 pasos para flujo vendedor. */
export function SellStepper({ currentStep }: SellStepperProps) {
  return (
    <View style={styles.container}>
      {STEPS.map((step, i) => {
        const completed = step.num < currentStep;
        const active = step.num === currentStep;

        return (
          <View key={step.num} style={styles.stepRow}>
            <View style={styles.stepCol}>
              <View
                style={[
                  styles.circle,
                  completed && styles.circleCompleted,
                  active && !completed && styles.circleActive,
                  !active && !completed && styles.circlePending,
                ]}
              >
                {completed ? (
                  <Ionicons color={colors.textPrimary} name="checkmark" size={16} />
                ) : (
                  <Text
                    style={[
                      styles.circleNum,
                      active && styles.circleNumActive,
                      !active && styles.circleNumPending,
                    ]}
                  >
                    {step.num}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  (active || completed) && styles.stepLabelActive,
                ]}
              >
                {step.label}
              </Text>
            </View>
            {i < STEPS.length - 1 && (
              <View
                style={[
                  styles.connector,
                  step.num < currentStep && styles.connectorDone,
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepRow: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  stepCol: {
    alignItems: "center",
    gap: spacing.xs,
  },
  circle: {
    alignItems: "center",
    borderRadius: radius.full,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  circleCompleted: {
    backgroundColor: colors.success,
  },
  circleActive: {
    backgroundColor: colors.primary,
  },
  circlePending: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  circleNum: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  circleNumActive: {
    color: colors.textPrimary,
  },
  circleNumPending: {
    color: colors.textMuted,
  },
  stepLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  stepLabelActive: {
    color: colors.primary,
  },
  connector: {
    backgroundColor: colors.border,
    flex: 1,
    height: 2,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.lg,
  },
  connectorDone: {
    backgroundColor: colors.primary,
  },
});
