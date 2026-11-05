/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FBF9F1',
        'surface-card': '#FFFFFF',
        'surface-muted': '#F3EFE6',
        ink: {
          DEFAULT: '#111827',
          muted: '#4B5563',
          subtle: '#6B7280',
        },
        duck: {
          DEFAULT: '#FEC62E',
          hover: '#E5B025',
          light: '#FFF9E6',
          dark: '#D97706',
        },
        code: {
          bg: '#0F172A',
          border: '#334155',
        },
        success: {
          bg: '#DCFCE7',
          text: '#15803D',
          border: '#86EFAC',
        },
        failure: {
          bg: '#FEE2E2',
          text: '#B91C1C',
          border: '#FCA5A5',
        }
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px #111827',
        'brutal': '4px 4px 0px #111827',
        'brutal-lg': '6px 6px 0px #111827',
      },
      fontFamily: {
        sans: ['Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}

