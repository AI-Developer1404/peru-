import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "var(--brand-color, #D4956A)",
          light: "var(--brand-color-light, #E8B896)",
          dark: "var(--brand-color-dark, #B87A4E)",
        },
        accent: {
          DEFAULT: "var(--accent-color, #7C9EB2)",
        },
        surface: {
          DEFAULT: "rgba(15, 12, 25, 0.45)",
          solid: "#0C0A14",
          elevated: "rgba(25, 20, 40, 0.55)",
          card: "rgba(20, 16, 32, 0.5)",
        },
      },
      backdropBlur: {
        glass: "24px",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(var(--brand-rgb, 212, 149, 106), 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(var(--brand-rgb, 212, 149, 106), 0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
