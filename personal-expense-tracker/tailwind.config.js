/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#212121',
          200: '#2a2a2a',
          300: '#333333',
          400: '#404040',
        },
      },
    },
  },
  plugins: [],
};