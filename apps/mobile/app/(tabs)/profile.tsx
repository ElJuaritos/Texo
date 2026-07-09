import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { listBuyerOffers, type Offer } from "@texo/shared";
import { LoadingState } from "../../components/ui/LoadingState";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { formatPrice } from "../../lib/format";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

/** Perfil con Mis ofertas real, menú simplificado y logout. */
export default function ProfileScreen() {
  const { client, session, profile, signOut } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOffers = useCallback(async () => {
    if (!client || !session?.user.id) return;
    const data = await listBuyerOffers(client, session.user.id);
    setOffers(data);
  }, [client, session?.user.id]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadOffers();
      setLoading(false);
    })();
  }, [loadOffers]);

  if (loading) return <LoadingState message="Cargando perfil…" />;

  const fullName =
    profile?.full_name ?? session?.user.email?.split("@")[0] ?? "Usuario";
  const email = session?.user.email ?? "";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const isAdmin = profile?.role === "admin";

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + spacing.lg },
      ]}
      style={styles.flex}
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{fullName}</Text>
          <View style={styles.verifiedRow}>
            <Ionicons color={colors.success} name="checkmark-circle" size={14} />
            <Text style={styles.verified}>Verificado</Text>
          </View>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <MenuItem
          icon="document-outline"
          label="Términos legales"
          onPress={() =>
            Alert.alert(
              "Términos legales",
              "Consulta los términos en la versión web de Texo.",
            )
          }
        />
      </View>

      <View style={styles.offersSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis ofertas</Text>
          {offers.length > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{offers.length}</Text>
            </View>
          ) : null}
        </View>
        {offers.length === 0 ? (
          <Text style={styles.emptyOffers}>
            Aún no has enviado ofertas. Explora el catálogo y usa &quot;Me interesa&quot;.
          </Text>
        ) : (
          offers.map((offer) => (
            <View key={offer.id} style={styles.offerRow}>
              <View>
                <Text style={styles.offerAmount}>{formatPrice(offer.amount)}</Text>
                <Text style={styles.offerMeta}>
                  {new Date(offer.created_at).toLocaleDateString("es-MX")}
                </Text>
              </View>
              <StatusBadge status={offer.status} />
            </View>
          ))
        )}
      </View>

      {isAdmin ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/admin")}
          style={styles.adminCard}
        >
          <View>
            <Text style={styles.adminTitle}>Panel de administración</Text>
            <Text style={styles.adminDesc}>Ofertas, inspección y transacciones</Text>
          </View>
          <View style={styles.staffBadge}>
            <Text style={styles.staffText}>Staff</Text>
          </View>
        </Pressable>
      ) : null}

      <Pressable accessibilityRole="button" onPress={() => signOut()} style={styles.logout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

interface MenuItemProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  badge?: number;
  onPress: () => void;
}

function MenuItem({ label, icon, badge, onPress }: MenuItemProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <Ionicons color={colors.textSecondary} name={icon} size={20} />
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <View style={styles.menuRight}>
        {badge && badge > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
        <Ionicons color={colors.textMuted} name="chevron-forward" size={18} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    backgroundColor: colors.background,
    flex: 1,
  },
  container: {
    gap: spacing.xl,
    padding: spacing.screen,
    paddingBottom: spacing.xxl * 2,
  },
  profileHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.lg,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  initials: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  verifiedRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  verified: {
    color: colors.success,
    fontSize: fontSize.sm,
  },
  email: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  menu: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuItem: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
  },
  menuLeft: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  menuLabel: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
  },
  menuRight: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    minWidth: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: colors.textPrimary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textAlign: "center",
  },
  offersSection: {
    gap: spacing.md,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  emptyOffers: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  offerRow: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.lg,
  },
  offerAmount: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  offerMeta: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  adminCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.lg,
  },
  adminTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  adminDesc: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  staffBadge: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  staffText: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  logout: {
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  logoutText: {
    color: colors.error,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
