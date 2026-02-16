import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Poppins", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        base: "#0f172a",
        accent: "#c2410c",
        ink: "#1f2937",
        mist: "#f3f4f6",
        sky: "#0ea5e9"
      },
      boxShadow: {
        panel: "0 10px 30px -15px rgba(2, 6, 23, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
