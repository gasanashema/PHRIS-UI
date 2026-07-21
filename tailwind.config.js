/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        page: '#F9FAFB',
        section: '#EBF5F4',
        card: '#FFFFFF',
        border: '#E5E7EB',
        primary: {
          DEFAULT: '#104E49',
          dark: '#0B3A36',
          hover: '#0B3A36',
        },
        text: {
          primary: '#111827',
          secondary: '#6B7280',
        },
        alert: {
          red: '#DC2626',
          orange: '#F59E0B',
          yellow: '#EAB308',
          green: '#16A34A',
        },
        admin: {
          DEFAULT: '#104E49',
          dark: '#0B3A36',
          hover: '#0B3A36',
          accent: '#00A550',
          info: '#1D72B8',
          red: '#D32F2F',
          amber: '#F59E0B',
          bg: '#F4F6F9',
          sidebar: '#104E49',
          text: '#1A1A2E',
          muted: '#6B7280',
        },
        epi: {
          DEFAULT: '#104E49',
          dark: '#0B3A36',
          hover: '#0B3A36',
          accent: '#00A550',
          info: '#1D72B8',
          red: '#D32F2F',
          amber: '#F59E0B',
          bg: '#F4F6F9',
          sidebar: '#104E49',
          text: '#1A1A2E',
          muted: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'floating': '0px 4px 24px rgba(0,0,0,0.08)',
        'card': '0px 4px 24px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
}