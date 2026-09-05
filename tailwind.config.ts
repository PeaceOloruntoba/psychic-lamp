import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0A1122",
          900: "#0F172A",
          800: "#152238",
          700: "#1C2E4A",
        },
        solar: {
          50: "#F3FEE0",
          100: "#E4FCB8",
          300: "#C3F566",
          400: "#A8E639",
          500: "#8FD11F", // primary lime accent from the flyer
          600: "#6FA916",
        },
        amber: {
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        emerald: {
          700: "#065F46",
          800: "#054A38",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% -10%, rgba(143,209,31,0.18), transparent 45%), radial-gradient(circle at 90% 10%, rgba(245,158,11,0.12), transparent 40%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(143,209,31,0.25), 0 8px 30px -8px rgba(143,209,31,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
