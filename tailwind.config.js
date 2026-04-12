/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif:  ['Bodoni Moda', 'Georgia', 'serif'],
        sans:   ['Montserrat', 'system-ui', 'sans-serif'],
        script: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      colors: {
        cream:       '#F4EFEA',
        charcoal:    '#2A2522',
        earth:       '#8B735B',
        taupe:       '#A68F7F',
        gold:        '#B8956A',
        'warm-gray': '#9A8A7A',
      },
      fontSize: {
        '10xl': '11rem',
        '11xl': '14rem',
        '12xl': '18rem',
      },
      letterSpacing: {
        widest2: '0.44em',
        widest3: '0.32em',
      },
    },
  },
  plugins: [],
}

