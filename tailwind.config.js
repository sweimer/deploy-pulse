/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontSize: {
      xs:   ['18px', { lineHeight: '26px' }],
      sm:   ['20px', { lineHeight: '28px' }],
      base: ['22px', { lineHeight: '30px' }],
      lg:   ['24px', { lineHeight: '32px' }],
      xl:   ['26px', { lineHeight: '34px' }],
      '2xl':['30px', { lineHeight: '38px' }],
      '3xl':['36px', { lineHeight: '44px' }],
    },
    boxShadow: {
        card: '0 2px 12px 0 rgba(0,0,0,0.06)',
        'card-hover': '0 6px 24px 0 rgba(0,0,0,0.10)',
        modal: '0 24px 64px 0 rgba(0,0,0,0.18)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.18s ease-out',
        'slide-up': 'slideUp 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
