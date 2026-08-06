/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      
      colors: {
        silver: '#C0C0C0',
        'silver-light': '#E5E5E5',
        'silver-dark': '#A0A0A0',
      },
      
    },
  },
  plugins: [],
}