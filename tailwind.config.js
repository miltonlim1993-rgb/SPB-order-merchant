/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-yellow': '#FFCB05', // Logo Main Color
        'brand-black': '#1A1A1A',  // Contrast
        'brand-red': '#DB0007',    // Call to action (McD style)
        'gray-surface': '#F4F4F4',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Oswald', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0,0,0,0.08)',
        'float': '0 8px 24px rgba(0,0,0,0.15)',
      },
      keyframes: {
        bump: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeOutRight: {
          '0%': { 
            opacity: '1', 
            transform: 'translateX(0)',
            maxHeight: '150px',
            marginBottom: '16px',
            paddingBottom: '0px'
          },
          '100%': { 
            opacity: '0', 
            transform: 'translateX(20px)',
            maxHeight: '0',
            marginBottom: '0',
            paddingBottom: '0'
          },
        }
      },
      animation: {
        'bump': 'bump 0.2s ease-in-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-out-right': 'fadeOutRight 0.3s ease-in forwards',
      }
    }
  },
  plugins: [],
}
