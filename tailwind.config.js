/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'slate-950': 'hsl(222 47.4% 4.2%)',
      },
    },
  },
  plugins: [require('windy-radix-palette')],
};
