/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customTeal: '#36BCBA', // Add your custom color here
      },
    },
  },
  plugins: [],
}

