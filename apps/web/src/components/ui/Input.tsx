import { cn } from "@/lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

/** Input estilizado del design system. */
export function Input({ label, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");

  return (
    <label className="block text-sm" htmlFor={inputId}>
      {label && (
        <span className="mb-1.5 block font-medium text-texo-text-secondary">
          {label}
        </span>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-xl border border-texo-border bg-texo-surface px-4 py-2.5 text-sm text-texo-text-primary placeholder:text-texo-text-muted outline-none transition focus:border-texo-primary focus:ring-1 focus:ring-texo-primary/50",
          className,
        )}
        {...props}
      />
    </label>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

/** Textarea estilizado del design system. */
export function Textarea({ label, className, id, ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");

  return (
    <label className="block text-sm" htmlFor={inputId}>
      {label && (
        <span className="mb-1.5 block font-medium text-texo-text-secondary">
          {label}
        </span>
      )}
      <textarea
        id={inputId}
        className={cn(
          "w-full rounded-xl border border-texo-border bg-texo-surface px-4 py-2.5 text-sm text-texo-text-primary placeholder:text-texo-text-muted outline-none transition focus:border-texo-primary focus:ring-1 focus:ring-texo-primary/50",
          className,
        )}
        {...props}
      />
    </label>
  );
}
