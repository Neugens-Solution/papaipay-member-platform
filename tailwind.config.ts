import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kasset: {
          ink: "#0e1726",
          green: "#a47c48",
          mint: "#f4eadc",
          sand: "#f6f3ed",
        },
      },
      boxShadow: {
        soft: "0 24px 80px rgba(14, 23, 38, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
