/** Logo Texo con ícono de auto. */
export function TexoLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { icon: "h-8 w-8", text: "text-xl" },
    md: { icon: "h-12 w-12", text: "text-2xl" },
    lg: { icon: "h-14 w-14", text: "text-4xl" },
  };
  const s = sizes[size];

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`flex ${s.icon} items-center justify-center rounded-2xl border border-texo-primary/40 bg-texo-primary/20`}
      >
        <svg
          className="h-6 w-6 text-texo-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 17h8M5 11l1.5-4h11L19 11M5 11v6h14v-6M7 17a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zm7 0a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z"
          />
        </svg>
      </div>
      <span className={`font-bold tracking-tight text-texo-text-primary ${s.text}`}>
        TEXO
      </span>
    </div>
  );
}
