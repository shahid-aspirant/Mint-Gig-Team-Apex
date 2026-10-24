/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#123D32',
          DEFAULT: '#1F7A5A',
          light: '#2E9E75',
          accent: '#B8F3D0',
          accentLight: '#E8FAF0',
          bg: '#F7F9F6',
          surface: '#FFFFFF',
          text: '#17221D',
          muted: '#68756D',
          border: '#E3E9E5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
