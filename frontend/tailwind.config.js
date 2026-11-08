/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#009a44',
          hover: '#007a35',
          light: '#ecfdf5',
          border: '#a7f3d0'
        },
        'ethiopian-gold': '#fed100',
        'ethiopian-red': '#ef2a24'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Ethiopic"', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
