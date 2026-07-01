import { useCallback, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

const STORAGE_KEY = "texo_favorites";

/** Favoritos locales (demo — paridad con web localStorage). */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    SecureStore.getItemAsync(STORAGE_KEY)
      .then((raw) => {
        if (raw) setFavorites(new Set(JSON.parse(raw) as string[]));
      })
      .catch(() => undefined);
  }, []);

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify([...next])).catch(
        () => undefined,
      );
      return next;
    });
  }, []);

  return { favorites, toggleFavorite: toggle };
}
