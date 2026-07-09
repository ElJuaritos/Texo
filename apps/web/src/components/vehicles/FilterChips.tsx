"use client";

import { cn } from "@/lib/cn";

export type FilterChip =
  | "all"
  | "certified"
  | "sedan"
  | "suv"
  | "under400"
  | "under600";

interface FilterChipsProps {
  active: FilterChip;
  onChange: (chip: FilterChip) => void;
}

const CHIPS: { id: FilterChip; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "certified", label: "Certificados" },
  { id: "sedan", label: "Sedán" },
  { id: "suv", label: "SUV" },
  { id: "under400", label: "< $400k" },
  { id: "under600", label: "< $600k" },
];

/** Chips de filtro horizontal scrollable. */
export function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {CHIPS.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={() => onChange(chip.id)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
            active === chip.id
              ? "bg-texo-primary text-white"
              : "border border-texo-border bg-texo-surface text-texo-text-secondary hover:border-texo-primary/50",
          )}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}

/** Barra de búsqueda con íconos. */
export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar autos...",
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  return (
    <div className="relative">
      <svg
        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-texo-text-muted"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full rounded-2xl border border-texo-border bg-texo-surface py-3.5 pl-12 pr-12 text-texo-text-primary placeholder:text-texo-text-muted outline-none transition focus:border-texo-primary focus:ring-1 focus:ring-texo-primary"
      />
      <svg
        className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-texo-text-muted"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
      </svg>
    </div>
  );
}
