/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',   // Royal Blue
        secondary: '#F59E0B', // Moroccan Amber
        dark: '#1E293B',      // Slate Dark
      },
    },
  },
  plugins: [],
}