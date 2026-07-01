interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

/** Estado de error con reintento opcional. */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
      <p className="text-sm font-medium text-red-800">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 text-sm font-medium text-teal-700 hover:text-teal-600"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
