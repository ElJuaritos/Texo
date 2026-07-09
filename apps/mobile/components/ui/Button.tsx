import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  type PressableProps,
} from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

type ButtonVariant = "primary" | "secondary" | "outline" | "success" | "danger";

interface ButtonProps extends Omit<PressableProps, "style"> {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

/** Botón pill del design system dark morado v2. */
export function Button({
  label,
  variant = "primary",
  loading = false,
  disabled,
  fullWidth = false,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "outline" && styles.outline,
        variant === "success" && styles.success,
        variant === "danger" && styles.danger,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "primary" || variant === "secondary"
              ? colors.textPrimary
              : colors.primary
          }
        />
      ) : (
        <Text
          style={[
            styles.label,
            variant === "primary" && styles.primaryLabel,
            variant === "secondary" && styles.secondaryLabel,
            variant === "outline" && styles.outlineLabel,
            variant === "success" && styles.successLabel,
            variant === "danger" && styles.dangerLabel,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radius.full,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  fullWidth: {
    width: "100%",
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: "transparent",
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: colors.border,
    borderWidth: 1,
  },
  success: {
    backgroundColor: colors.successBg,
    borderColor: "rgba(34,197,94,0.3)",
    borderWidth: 1,
  },
  danger: {
    backgroundColor: colors.errorBg,
    borderColor: "rgba(239,68,68,0.3)",
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  primaryLabel: {
    color: colors.textPrimary,
  },
  secondaryLabel: {
    color: colors.textPrimary,
  },
  outlineLabel: {
    color: colors.textPrimary,
  },
  successLabel: {
    color: colors.success,
  },
  dangerLabel: {
    color: colors.error,
  },
});
