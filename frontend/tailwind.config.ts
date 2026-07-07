import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#4a6cf7",
          dark: "#3652c9",
        },
      },
    },
  },
  plugins: [],
};

export default config;
