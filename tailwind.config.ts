import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0b0d",
        surface: "#121316",
        surface2: "#1a1c1f",
        border: "#26282c",
        text: "#f2f2f0",
        "text-dim": "#9a9c9f",
        "text-faint": "#5c5e62",
        accent: "#e8622c",
        "accent-dim": "#3a2318",
        ok: "#3fae6b",
        warn: "#d9a441",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
