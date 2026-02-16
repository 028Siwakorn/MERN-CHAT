/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        sechat: {
          primary: "#F97316",
          "primary-content": "#ffffff",
          secondary: "#374151",
          accent: "#F97316",
          neutral: "#1A1D20",
          "base-100": "#1A1D20",
          "base-200": "#111317",
          "base-300": "#0D0F11",
          info: "#6B7280",
          success: "#22c55e",
          warning: "#eab308",
          error: "#ef4444",
        },
      },
      "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro",
      "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel",
      "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business",
      "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset",
    ],
  },
};
