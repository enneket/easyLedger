/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981', // emerald-500
          foreground: '#FFFFFF',
          ...colors.emerald,
        },
        background: '#F3F4F6',
        surface: '#FFFFFF',
        text: {
          primary: '#111827', // gray-900
          secondary: '#6B7280', // gray-500
        }
      }
    },
  },
  plugins: [],
};