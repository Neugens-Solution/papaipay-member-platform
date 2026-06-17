import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        papaipay: {
          ink: "#10201a",
          green: "#0f7a4f",
          mint: "#dff7ec",
          sand: "#f6f1e8",
        },
      },
      boxShadow: {
        soft: "0 24px 80px rgba(16, 32, 26, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
