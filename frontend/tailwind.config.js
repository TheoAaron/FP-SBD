/** @type {import('tailwindcss').Config} */
module.exports = {  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#363738",
        secondary: "#7d8184",
        highlight: "#db4444",
        background: "#f0f0f0",
        foreground: "#171717",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}
