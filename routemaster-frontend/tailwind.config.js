// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'underline-expand': 'underlineExpand 0.3s ease forwards',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'underlineExpand': {
          '0%': { width: '0', transform: 'translateX(-50%)' },
          '100%': { width: '80%', transform: 'translateX(-50%)' },
        },
      },
    }
  },
  plugins: [],
}
