"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "texo_favorites";

/** Favoritos locales (demo — sin tabla DB). */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setFavorites(new Set(JSON.parse(raw) as string[]));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { favorites, toggleFavorite: toggle };
}
