import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

/** Estado de error con reintento opcional. */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-texo-error/30 bg-texo-error/10 px-6 py-8 text-center">
      <p className="text-sm font-medium text-texo-error">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-4 px-6 py-2">
          Reintentar
        </Button>
      )}
    </div>
  );
}
