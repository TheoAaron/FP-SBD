// import type { Config } from "tailwindcss";

// const config: Config = {
//   content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],

//   theme: {
//     extend: {
//       colors: {
//         primary: "#363738",
//         secondary: "#7d8184",
//         highlight: "#db4444",
//         background: "#f0f0f0",
//         foreground: "#171717",
//       },
//       fontFamily: {
//         sans: ["Poppins", "sans-serif"],
//       },
//     },
//   },

//   plugins: [],
// };

// export default config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // './pages/**/*.{js,ts,jsx,tsx}',
    // './components/**/*.{js,ts,jsx,tsx}',
    // add more paths if needed
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
