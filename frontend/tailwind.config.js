/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
'./app/**/*.{js,ts,jsx,tsx,mdx}',
'./components/**/*.{js,ts,jsx,tsx,mdx}',
'./hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:'#f0fdf4',
          100:'#dcfce7',
          500:'#22c55e',
          600:'#16a34a',
          900:'#14532d',
        },
        dark: {
          900:'#0a0a0c',
          800:'#121216',
          700:'#1a1a22',
        }
      },
      aspectRatio: {
'9/16':'9 / 16',
      },
    },
  },
  plugins: [],
}
