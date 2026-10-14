import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        luga: {
          bg: "#F8F6F2",
          surface: "#EFECE6",
          surfaceHover: "#E6E2D8",
          ink: "#111111",
          muted: "#5C5A55",
          border: "#E2DED7",
          darkBg: "#0A0A0A",
          darkSurface: "#141414",
          darkSurfaceHover: "#1F1F1F",
          darkInk: "#F5F3EF",
          darkMuted: "#9A968E",
          darkBorder: "#262626",
          crimson: "#8B2616",
          gold: "#C2A265",
        },
      },
      fontFamily: {
        serif: [
          "var(--font-serif)",
          "Cormorant Garamond",
          "Playfair Display",
          "Didot",
          "Georgia",
          "serif",
        ],
        sans: [
          "var(--font-sans)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "JetBrains Mono",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      letterSpacing: {
        ultra: "0.25em",
        mega: "0.35em",
      },
      borderRadius: {
        none: "0px",
      },
    },
  },
  plugins: [],
};
export default config;
