/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Path ini memberitahu Tailwind file mana yang harus dipindai
  ],
  theme: {
    extend: {
      fontFamily: {
        'moderniz': ['Moderniz', 'sans-serif'],
        'bauhaus': ['Bauhaus93', 'sans-serif'],
        'cascadia': ['Cascadia Code', 'monospace'],
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'space': ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        neu: {
          base: '#E8ECF1',
          card: '#ECF0F3',
          'shadow-light': '#FFFFFF',
          'shadow-dark': '#A3B1C6',
          primary: '#2E3440',
          secondary: '#6B7785',
          accent: '#7C6EF2',
          'accent-secondary': '#F2739E',
        }
      },
      boxShadow: {
        'neu-flat': '8px 8px 16px #A3B1C6, -8px -8px 16px #FFFFFF',
        'neu-flat-sm': '4px 4px 8px #A3B1C6, -4px -4px 8px #FFFFFF',
        'neu-flat-lg': '12px 12px 24px #A3B1C6, -12px -12px 24px #FFFFFF',
        'neu-inset': 'inset 5px 5px 10px #A3B1C6, inset -5px -5px 10px #FFFFFF',
        'neu-inset-sm': 'inset 3px 3px 6px #A3B1C6, inset -3px -3px 6px #FFFFFF',
        'neu-inset-deep': 'inset 6px 6px 12px #A3B1C6, inset -6px -6px 12px #FFFFFF',
        'neu-hover': '12px 12px 24px #98a7bd, -12px -12px 24px #FFFFFF',
        'neu-pressed': 'inset 4px 4px 8px #A3B1C6, inset -4px -4px 8px #FFFFFF',
      },
      animation: {
        shadowFade: 'shadowFade 5s infinite ease-in-out',
        gradient: 'gradient 8s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
      },
      keyframes: {
        shadowFade: {
          '0%, 100%': { filter: 'drop-shadow(-1px 6px 3px rgba(0, 255, 255, 0.5))' },
          '50%': { filter: 'drop-shadow(-1px 6px 3px rgba(0, 255, 255, 0.3))' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}
