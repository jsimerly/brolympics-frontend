/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#339989",
        primaryLight: "#7DE2D1",
        secondary: "#FAF3C5", 
        secondaryLight: '#ffffff',
        neutralDark: '#131515',
        neutral: '#2B2C28',
        neutralLight: '#53564E',
        offWhite: '#FFFAFB',
        errorRed: '#C76C63',
        errorRedLight : '#d9928d'
      },
      fontFamily: {
        roboto : ['Roboto', 'serif'],
        londrina: ['Londrina Solid', 'sans-serif']
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

