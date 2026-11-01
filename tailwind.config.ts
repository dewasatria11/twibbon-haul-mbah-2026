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
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      colors: {
        paper: {
          50: "#FCFAF6",
          100: "#FAF7F2",
          200: "#F3EDE2",
        },
        royal: {
          50: "#F0F7F4",
          100: "#E2F0EA",
          200: "#C4E0D4",
          700: "#185B46",
          800: "#134E3A",
          900: "#0D382A",
          950: "#07231A",
          DEFAULT: "#0F3E2F",
        },
        gold: {
          50: "#FDFBF7",
          100: "#FAF4E8",
          200: "#F3E7CE",
          300: "#E8D3A7",
          400: "#D9BC7F",
          500: "#C5A059",
          600: "#A9833E",
          700: "#87662C",
          DEFAULT: "#C5A059",
        },
      },
      boxShadow: {
        soft: "0 2px 12px -2px rgba(15, 62, 47, 0.06)",
        card: "0 10px 30px -4px rgba(15, 62, 47, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)",
        "card-hover": "0 20px 40px -8px rgba(15, 62, 47, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.04)",
        modal: "0 25px 60px -15px rgba(15, 62, 47, 0.25)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;

