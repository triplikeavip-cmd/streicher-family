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
          '0%': { transform: 'translateY(-40px)', opacity: '0' },
          '60%': { transform: 'translateY(6px)', opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(20px, -30px)' },
        },
        drift: {
          '0%': { transform: 'translate(0, 0)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translate(30px, -100px)', opacity: '0' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
      },
      animation: {
        dropIn: 'dropIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fadeUp: 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        float: 'float 8s ease-in-out infinite',
        'float-delayed': 'float 9s ease-in-out infinite 1.5s',
        drift: 'drift linear infinite',
        'spin-slow': 'spinSlow 12s linear infinite',
        'pulse-slow': 'pulseSlow 6s ease-in-out infinite',
        breathe: 'breathe 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}