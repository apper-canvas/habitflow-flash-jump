/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        secondary: '#8B5CF6',
        accent: '#10B981',
        surface: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      animation: {
        'check': 'check 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'progress': 'progress 0.4s ease-in-out',
      },
      keyframes: {
        check: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        progress: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' }
        }
      }
    },
  },
  plugins: [],
}