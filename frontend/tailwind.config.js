/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#121212',   // Main Background (Spotify style)
          dark: '#181818',    // Cards / Sidebar
          gray: '#b3b3b3',    // Secondary Text
          white: '#ffffff',   // Primary Text
          primary: '#1db954', // Accent Green (or keep your blue if you prefer)
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['Cairo', 'sans-serif'], // Important for your Arabic text
      },
    },
  },
  plugins: [],
}