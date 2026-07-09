import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import type { UserRole } from "@texo/shared";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { TexoLogo } from "../../components/ui/TexoLogo";
import { useAuth } from "../../hooks/useAuth";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

type AuthMode = "login" | "signup";

const TRUST_BADGES = [
  "Inspección verificada",
  "Escrow seguro",
  "Sin chat directo",
];

/** Onboarding login/registro dark morado — paridad con web AuthForm. */
export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) {
      Alert.alert("Error", "Completa email y contraseña");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(email.trim(), password);
      } else {
        if (!fullName.trim()) {
          Alert.alert("Error", "Ingresa tu nombre");
          return;
        }
        await signUp(email.trim(), password, fullName.trim(), role);
        Alert.alert("Cuenta creada", "Ya puedes iniciar sesión.");
        setMode("login");
      }
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Intenta de nuevo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.glow} pointerEvents="none" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TexoLogo size="lg" />

          <Text style={styles.tagline}>
            Compra y vende tu auto con total confianza
          </Text>

          <View style={styles.badges}>
            {TRUST_BADGES.map((badge) => (
              <Text key={badge} style={styles.badgeItem}>
                <Text style={styles.badgeCheck}>✓ </Text>
                {badge}
              </Text>
            ))}
          </View>

          {mode === "signup" ? (
            <>
              <TextField
                label="Nombre completo"
                onChangeText={setFullName}
                placeholder="Tu nombre"
                value={fullName}
              />
              <View style={styles.roleGroup}>
                <Text style={styles.roleLabel}>Quiero</Text>
                <View style={styles.roleRow}>
                  {(["buyer", "seller"] as const).map((r) => (
                    <Pressable
                      key={r}
                      accessibilityRole="button"
                      onPress={() => setRole(r)}
                      style={[styles.roleCard, role === r && styles.roleCardActive]}
                    >
                      <Text style={styles.roleTitle}>
                        {r === "buyer" ? "Comprar" : "Vender"}
                      </Text>
                      <Text style={styles.roleDesc}>
                        {r === "buyer"
                          ? "Busco un auto certificado"
                          : "Quiero publicar mi auto"}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </>
          ) : null}

          <TextField
            autoCapitalize="none"
            keyboardType="email-address"
            label="Correo"
            onChangeText={setEmail}
            placeholder="tu@email.com"
            value={email}
          />
          <TextField
            label="Contraseña"
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            value={password}
          />

          <Button
            fullWidth
            label={mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            loading={loading}
            onPress={handleSubmit}
          />

          <Button
            fullWidth
            label={mode === "login" ? "Crear cuenta" : "Iniciar sesión"}
            onPress={() => setMode(mode === "login" ? "signup" : "login")}
            variant="secondary"
          />

          <Text style={styles.terms}>
            Al continuar aceptas los{" "}
            <Text style={styles.termsLink}>Términos y Condiciones</Text> de Texo
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1,
    overflow: "hidden",
  },
  glow: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 220,
    left: "15%",
    opacity: 0.1,
    position: "absolute",
    right: "15%",
    top: 0,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    gap: spacing.xl,
    justifyContent: "center",
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.xxl,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 22,
    textAlign: "center",
  },
  badges: {
    alignItems: "center",
    gap: spacing.xs,
  },
  badgeItem: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },
  badgeCheck: {
    color: colors.primary,
  },
  roleGroup: {
    gap: spacing.sm,
  },
  roleLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  roleRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  roleCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    padding: spacing.md,
  },
  roleCardActive: {
    backgroundColor: "rgba(124,58,237,0.1)",
    borderColor: colors.primary,
  },
  roleTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  roleDesc: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  terms: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    lineHeight: 18,
    textAlign: "center",
  },
  termsLink: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
});
