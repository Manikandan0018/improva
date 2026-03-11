/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Syne"', 'sans-serif'],
        'body': ['"DM Sans"', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        'bus': {
          'dark': '#0A0E1A',
          'darker': '#060910',
          'panel': '#0F1525',
          'border': '#1E2A45',
          'accent': '#F97316',
          'accent2': '#FB923C',
          'green': '#22C55E',
          'red': '#EF4444',
          'blue': '#3B82F6',
          'text': '#E2E8F0',
          'muted': '#64748B',
        }
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      boxShadow: {
        'seat': '0 0 15px rgba(34, 197, 94, 0.3)',
        'seat-red': '0 0 15px rgba(239, 68, 68, 0.3)',
        'accent': '0 0 30px rgba(249, 115, 22, 0.4)',
        'panel': '0 4px 30px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
