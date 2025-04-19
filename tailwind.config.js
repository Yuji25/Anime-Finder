/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}",
    ],
    theme: {
      extend: {
        colors: {
          blue: {
            400: '#60A5FA',
            500: '#3B82F6',
            600: '#2563EB',
            700: '#1D4ED8',
          },
          gray: {
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          }
        },
        animation: {
          'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        keyframes: {
          pulse: {
            '0%, 100%': { opacity: 0.5 },
            '50%': { opacity: 0.8 },
          }
        },
        screens: {
          'xs': '475px',
        },
        boxShadow: {
          'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        },
      },
    },
    safelist: [
      'bg-gray-900',
      'bg-gray-800',
      'bg-gray-700',
      'text-white',
      'text-gray-300',
      'text-gray-400',
      'text-blue-400',
      'text-blue-500',
      'bg-blue-600',
      'bg-blue-500',
    ],
    plugins: [],
  }  