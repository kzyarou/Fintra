export default {
  darkMode: 'class',
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#FAFAF7',
        emerald: {
          DEFAULT: '#f39d54',
          50: '#fef5ee',
          100: '#fcebdc',
          500: '#f39d54',
          600: '#e68a41',
          700: '#cc7333',
        },
        charcoal: {
          DEFAULT: '#1C1C1E',
          light: '#3A3A3C',
        },
        softgray: {
          DEFAULT: '#F0EEEB',
          dark: '#E5E3E0',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 30px -5px rgba(13, 107, 75, 0.15)',
      }
    },
  },
  plugins: [],
}