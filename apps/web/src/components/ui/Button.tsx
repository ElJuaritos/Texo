import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "success" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-texo-primary text-white hover:bg-texo-primary-hover active:scale-95",
  secondary:
    "border border-white/20 bg-transparent text-texo-text-primary hover:border-texo-primary/60 hover:bg-white/5",
  ghost: "bg-transparent text-texo-text-secondary hover:text-texo-text-primary",
  success:
    "border border-texo-success/30 bg-texo-success/10 text-texo-success hover:bg-texo-success/20",
  danger:
    "border border-texo-error/30 bg-texo-error/10 text-texo-error hover:bg-texo-error/20",
};

/** Botón base del design system dark morado. */
export function Button({
  variant = "primary",
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
