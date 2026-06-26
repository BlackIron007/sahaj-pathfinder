import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fff9ee",
        foreground: "#373223",
        card: {
          DEFAULT: "#fffbf2",
          foreground: "#373223",
        },
        soft: "#f5eddd",
        primary: {
          DEFAULT: "#715b3e",
          hover: "#644f33",
        },
        secondary: "#6b5d4f",
        border: "#b9b29c",
        status: {
          approved: {
            bg: "#c4f7d3",
            accent: "#3a684d",
          },
          blocked: {
            bg: "#fff7f6",
            accent: "#9e422c",
          },
          warning: {
            accent: "#b57a3d",
          },
        },
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
