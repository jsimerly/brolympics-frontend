/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#33a1d6",
          DEFAULT: "#0081C8",
          dark: "#006396",
        },
        secondary: {
          light: "#fcc55a",
          DEFAULT: "#FCB131",
          dark: "#fa9d04",
        },
        tertiary: {
          light: "#33b774",
          DEFAULT: "#00A651",
          dark: "#007d3d",
        },
        red: {
          light: "#f15c72",
          DEFAULT: "#EE334E",
          dark: "#e60f2e",
        },
        errorRed: {
          light: "#d9928d",
          DEFAULT: "#C76C63",
          dark: "#b5463b",
        },
      },
      fontFamily: {
        sans: [
          "Roboto",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        roboto: ["Roboto", "sans-serif"],
      },
      textColor: {
        DEFAULT: "#333333",
        "near-black": "#111111", // Corrected from "#11111"
        light: "#666666",
        primary: "#0081C8",
        muted: "#AAAAAA",
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      ms: "840px",
      md: "1060px",
      lg: "1280px",
      xl: "1700px",
    },
  },
  plugins: [],
};
