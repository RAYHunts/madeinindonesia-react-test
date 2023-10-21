/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.jsx",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#821414',
        secondary: '#111D4A',
        white: '#FFF8F0',
      },
      fontFamily: {
        jakarta: ['Plus Jakarta Sans' , 'sans-serif'],
      },
    },
  },
  plugins: [],
}

