/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        family: {
          black: '#0A0A0A',
          charcoal: '#151515',
          card: '#1C1C1C',
          border: '#2A2A2A',
          gold: '#D4AF37',
          goldSoft: '#E8C766',
          white: '#F5F5F0',
          muted: '#9A9A93',
        },
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      keyframes: {
        dropIn: {
          '0%': { transform: 'translateY(-60px)', opacity: '0' },
          '60%': { transform: 'translateY(8px)', opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        dropIn: 'dropIn 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fadeUp: 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
}