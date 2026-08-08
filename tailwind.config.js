/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        clash: ['Clash Display', 'Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0035AD',
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd3ff',
          300: '#8eb6ff',
          400: '#5a8ffb',
          500: '#336bf6',
          600: '#1a4fdc',
          700: '#0035AD',
          800: '#002d8f',
          900: '#00266f',
          950: '#001a4a',
        },
        accent: {
          DEFAULT: '#F4E11B',
          50: '#fffeda',
          100: '#fffcb0',
          200: '#fff87a',
          300: '#fff23a',
          400: '#F4E11B',
          500: '#e6cd00',
          600: '#c9ad00',
          700: '#9c8400',
          800: '#7e6a00',
          900: '#665400',
        },
        ink: '#1A1A1A',
        secondary: '#666666',
        cream: '#FAFAF7',
        sand: '#F7F5F2',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
      },
      boxShadow: {
        premium: '0 1px 3px rgba(26,26,26,0.04), 0 8px 30px rgba(26,26,26,0.05)',
        'premium-lg': '0 4px 12px rgba(26,26,26,0.05), 0 24px 60px rgba(26,26,26,0.08)',
        card: '0 1px 3px rgba(26,26,26,0.03), 0 6px 20px rgba(26,26,26,0.04)',
        'card-hover': '0 8px 24px rgba(26,26,26,0.08), 0 24px 56px rgba(26,26,26,0.10)',
        soft: '0 1px 2px rgba(26,26,26,0.03)',
        glow: '0 8px 30px rgba(244, 225, 27, 0.35)',
        'blue-soft': '0 8px 30px rgba(0, 53, 173, 0.12)',
      },
      animation: {
        'spin-slow': 'spin 24s linear infinite',
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
};
