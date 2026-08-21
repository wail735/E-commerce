export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Bricolage Grotesque", "sans-serif"],
      },
      colors: {
        primary: "#FF4D20",
        orange: "#FF8A00",
        yellow: "#FFC107",
        dark: "#0B1120",
        light: "#F5F5F5",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },

      boxShadow: {
        card: "0 4px 20px rgba(0, 0, 0, 0.08)",
        orange: "0 8px 25px rgba(255, 77, 32, 0.25)",
      },

      transitionDuration: {
        250: "250ms",
        350: "350ms",
      },
    },
  },
  plugins: [],
}
