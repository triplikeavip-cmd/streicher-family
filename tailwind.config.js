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
          cream: '#FFFBF5',
          warm: '#F2A65A',
          deep: '#3A2E2A',
          soft: '#F7E6D3',
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
      },
      animation: {
        dropIn: 'dropIn 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
}