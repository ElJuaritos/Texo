import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

export type FilterChipId =
  | "all"
  | "certified"
  | "sedan"
  | "suv"
  | "under400k"
  | "under600k";

const CHIPS: { id: FilterChipId; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "certified", label: "Certificados" },
  { id: "sedan", label: "Sedán" },
  { id: "suv", label: "SUV" },
  { id: "under400k", label: "< $400k" },
  { id: "under600k", label: "< $600k" },
];

interface FilterChipsProps {
  active: FilterChipId;
  onChange: (id: FilterChipId) => void;
}

/** Chips de filtro horizontal scrollable. */
export function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {CHIPS.map((chip) => {
        const isActive = active === chip.id;
        return (
          <Pressable
            key={chip.id}
            accessibilityRole="button"
            onPress={() => onChange(chip.id)}
            style={[styles.chip, isActive ? styles.chipActive : styles.chipInactive]}
          >
            <Text style={[styles.chipText, isActive ? styles.chipTextActive : styles.chipTextInactive]}>
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

/** Barra de búsqueda con ícono lupa. */
export function SearchBar({
  value,
  onChangeText,
  placeholder = "Buscar autos...",
  autoFocus,
}: SearchBarProps) {
  return (
    <View style={styles.searchWrap}>
      <Ionicons
        color={colors.textMuted}
        name="search-outline"
        size={20}
        style={styles.searchIcon}
      />
      <TextInput
        autoFocus={autoFocus}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.searchInput}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  chipText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  chipTextActive: {
    color: colors.textPrimary,
  },
  chipTextInactive: {
    color: colors.textSecondary,
  },
  searchWrap: {
    position: "relative",
  },
  searchIcon: {
    left: spacing.lg,
    position: "absolute",
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: fontSize.base,
    paddingLeft: 44,
    paddingRight: spacing.lg,
    paddingVertical: spacing.md,
  },
});
