/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'tailly': '#f7f6fb',
        'up': '#ffbb20'
      },
    },
  },
  plugins: [],
}