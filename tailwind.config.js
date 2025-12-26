/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // iOS-inspired color palette
        background: '#F9F9F9',
        card: '#FFFFFF',
        separator: 'rgba(0, 0, 0, 0.1)',
        accent: {
          DEFAULT: '#FF6B9D', // Rose/blush accent
          light: '#FFE5ED',
          dark: '#E85A8A',
        },
        text: {
          primary: '#000000',
          secondary: 'rgba(0, 0, 0, 0.6)',
          tertiary: 'rgba(0, 0, 0, 0.4)',
        },
        // Handwritten fonts only for gifts/letters
        handwritten: {
          DEFAULT: '#D4A5A5',
        },
      },
      fontFamily: {
        // System font stack (SF Pro-like)
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
        // Only for gifts/letters content
        handwritten: ['"Dancing Script"', 'cursive'],
      },
      fontSize: {
        // iOS-style font sizing
        'large-title': ['34px', { lineHeight: '41px', fontWeight: '700' }],
        'title-1': ['28px', { lineHeight: '34px', fontWeight: '700' }],
        'title-2': ['22px', { lineHeight: '28px', fontWeight: '700' }],
        'title-3': ['20px', { lineHeight: '25px', fontWeight: '600' }],
        'headline': ['17px', { lineHeight: '22px', fontWeight: '600' }],
        'body': ['17px', { lineHeight: '22px', fontWeight: '400' }],
        'callout': ['16px', { lineHeight: '21px', fontWeight: '400' }],
        'subhead': ['15px', { lineHeight: '20px', fontWeight: '400' }],
        'footnote': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'caption-1': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'caption-2': ['11px', { lineHeight: '13px', fontWeight: '400' }],
      },
      spacing: {
        // iOS-style spacing scale
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      borderRadius: {
        // iOS card radius
        'card': '16px',
        'card-lg': '20px',
      },
      boxShadow: {
        // Subtle iOS shadows
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
      transitionDuration: {
        // iOS motion timing
        'ios': '200ms',
      },
      transitionTimingFunction: {
        'ios': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

