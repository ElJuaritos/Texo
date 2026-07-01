interface LoadingSpinnerProps {
  label?: string;
}

/** Indicador de carga centrado. */
export function LoadingSpinner({ label = "Cargando…" }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-teal-700 border-t-transparent"
        role="status"
        aria-label={label}
      />
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
