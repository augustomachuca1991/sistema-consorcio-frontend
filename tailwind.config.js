/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'



export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      green: colors.emerald,
      purple: colors.violet,
      pink: colors.fuchsia,
      red: colors.red,

      'primary': '#56CAC5',
      'secondary': '#007FEC'
    }
  },
  variants: {
    extend: {
      textTransform: ['first-letter'],
    },
  },
  plugins: [],
}

