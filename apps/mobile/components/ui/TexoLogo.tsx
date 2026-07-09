import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

interface TexoLogoProps {
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { icon: 32, text: fontSize.xl },
  md: { icon: 48, text: fontSize.xxl },
  lg: { icon: 56, text: 32 },
};

/** Logo Texo con ícono de auto en contenedor morado. */
export function TexoLogo({ size = "md" }: TexoLogoProps) {
  const s = SIZES[size];

  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, { height: s.icon, width: s.icon }]}>
        <Ionicons color={colors.primary} name="car-sport" size={s.icon * 0.5} />
      </View>
      <Text style={[styles.wordmark, { fontSize: s.text }]}>TEXO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.md,
  },
  iconBox: {
    alignItems: "center",
    backgroundColor: "rgba(124,58,237,0.2)",
    borderColor: "rgba(124,58,237,0.4)",
    borderRadius: radius.lg,
    borderWidth: 1,
    justifyContent: "center",
  },
  wordmark: {
    color: colors.textPrimary,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.5,
  },
});
