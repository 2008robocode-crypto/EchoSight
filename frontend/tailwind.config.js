/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accessible: {
          yellow: '#FFDD00',
          cyan: '#00F0FF',
          dark: '#0A0D14',
          card: '#141824',
          border: '#232936',
          danger: '#FF3366',
          success: '#00E676'
        }
      }
    },
  },
  plugins: [],
}
