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
        mist: "#f8fafc",
        sky: "#0ea5e9"
      },
      boxShadow: {
        panel: "0 10px 30px -15px rgba(2, 6, 23, 0.35)",
        card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        glow: "0 0 40px rgba(14, 165, 233, 0.15)"
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out both",
        "slide-left": "slideInLeft 0.6s ease-out both",
        "slide-right": "slideInRight 0.6s ease-out both",
        float: "float 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
