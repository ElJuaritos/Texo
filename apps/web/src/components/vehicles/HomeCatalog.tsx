"use client";

import type { VehicleCatalogItem } from "@texo/shared";
import { resolveVehiclePrice } from "@texo/shared";
import { useMemo, useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { VehicleGrid } from "@/components/vehicles/VehicleCard";
import { FilterChips, SearchBar, type FilterChip } from "@/components/vehicles/FilterChips";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { fetchPublishedVehiclesForCatalog } from "@/lib/data/vehicles";

interface HomeCatalogProps {
  initialVehicles: VehicleCatalogItem[];
  initialError?: string | null;
}

function applyChipFilter(
  vehicles: VehicleCatalogItem[],
  chip: FilterChip,
): VehicleCatalogItem[] {
  switch (chip) {
    case "certified":
      return vehicles.filter(
        (v) => v.inspection_score != null && v.inspection_score >= 75,
      );
    case "sedan":
      return vehicles.filter((v) =>
        ["corolla", "sentra", "jetta", "c-class", "sedan"].some((k) =>
          `${v.make} ${v.model} ${v.trim ?? ""}`.toLowerCase().includes(k),
        ),
      );
    case "suv":
      return vehicles.filter((v) =>
        ["suv", "cx", "x3", "x5", "rav4", "cr-v"].some((k) =>
          `${v.make} ${v.model}`.toLowerCase().includes(k),
        ),
      );
    case "under400":
      return vehicles.filter(
        (v) =>
          (resolveVehiclePrice(v.listing_price, v.estimated_price) ?? 0) < 400000,
      );
    case "under600":
      return vehicles.filter(
        (v) =>
          (resolveVehiclePrice(v.listing_price, v.estimated_price) ?? 0) < 600000,
      );
    default:
      return vehicles;
  }
}

/** Catálogo comprador con búsqueda, filtros y secciones. */
export function HomeCatalog({ initialVehicles, initialError }: HomeCatalogProps) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [error, setError] = useState(initialError ?? null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState<FilterChip>("all");
  const { favorites, toggleFavorite } = useFavorites();

  async function reload() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPublishedVehiclesForCatalog();
      setVehicles(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    let result = applyChipFilter(vehicles, activeChip);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          String(v.year).includes(q),
      );
    }
    return result;
  }, [vehicles, activeChip, search]);

  const certified = useMemo(
    () =>
      filtered.filter(
        (v) => v.inspection_score != null && v.inspection_score >= 75,
      ),
    [filtered],
  );

  const recommended = useMemo(() => {
    if (activeChip !== "all" || search.trim()) return filtered;
    const certifiedIds = new Set(certified.map((v) => v.id));
    return filtered.filter((v) => !certifiedIds.has(v.id));
  }, [filtered, certified, activeChip, search]);

  if (error) {
    return <ErrorState message={error} onRetry={reload} />;
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm text-texo-text-secondary">Bienvenido</p>
        <h1 className="text-2xl font-bold text-texo-text-primary">TEXO</h1>
      </header>

      <SearchBar value={search} onChange={setSearch} />
      <FilterChips active={activeChip} onChange={setActiveChip} />

      {loading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No hay vehículos"
          description="Prueba ajustando los filtros o vuelve más tarde."
        />
      ) : (
        <>
          {certified.length > 0 && activeChip === "all" && !search && (
            <section className="space-y-3">
              <h2 className="flex items-center gap-2 font-semibold text-texo-text-primary">
                <span className="text-texo-primary">◉</span> Certificados Texo
              </h2>
              <VehicleGrid
                vehicles={certified}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            </section>
          )}

          <section className="space-y-3">
            <h2 className="font-semibold text-texo-text-primary">
              {search ? `${filtered.length} resultados` : "Recomendados para ti"}
            </h2>
            <VehicleGrid
              vehicles={search || activeChip !== "all" ? filtered : recommended}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </section>
        </>
      )}
    </div>
  );
}

/** Vista de búsqueda dedicada (/search). */
export function SearchCatalog({ initialVehicles }: { initialVehicles: VehicleCatalogItem[] }) {
  const [search, setSearch] = useState("");
  const { favorites, toggleFavorite } = useFavorites();

  const filtered = useMemo(() => {
    if (!search.trim()) return initialVehicles;
    const q = search.toLowerCase();
    return initialVehicles.filter(
      (v) =>
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        String(v.year).includes(q),
    );
  }, [initialVehicles, search]);

  return (
    <div className="space-y-5">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Marca, modelo, año..."
        autoFocus
      />
      <p className="text-sm text-texo-text-secondary">
        {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="Sin resultados para tu búsqueda"
          description="Prueba con otra marca, modelo o año."
        />
      ) : (
        <VehicleGrid
          vehicles={filtered}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}
