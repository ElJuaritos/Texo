interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

/** Estado vacío reutilizable. */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <p className="text-lg font-semibold text-slate-800">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
