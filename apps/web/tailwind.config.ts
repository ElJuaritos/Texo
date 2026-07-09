import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        texo: {
          background: "#0B0F19",
          surface: "#151B28",
          "surface-elevated": "#1E2638",
          border: "#2A3347",
          primary: "#7C3AED",
          "primary-hover": "#8B5CF6",
          "primary-muted": "#2D1B69",
          "text-primary": "#F8FAFC",
          "text-secondary": "#94A3B8",
          "text-muted": "#64748B",
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
      boxShadow: {
        "texo-card": "0 4px 24px rgba(0, 0, 0, 0.4)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.2s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
