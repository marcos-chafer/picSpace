/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'custom':['Montserrat'],
      }
    },
  },
  plugins: [
    require('tailwind-children'),
  ],
}