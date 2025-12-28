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
        // Lovebirds color palette
        background: '#F7F8F6',
        card: '#FFFFFF',
        separator: 'rgba(0, 0, 0, 0.1)',
        // Primary colors
        primary: {
          DEFAULT: '#6A53FF', // Deep Purple
          light: '#E9E4FF', // Lavender
          dark: '#5643D9',
        },
        accent: {
          DEFAULT: '#FF7A73', // Coral
          light: '#FFE5E3',
          dark: '#E85A53',
        },
        secondary: {
          DEFAULT: '#FFD9A6', // Soft Peach
          light: '#FFF0DC',
          dark: '#F5C57A',
        },
        text: {
          primary: '#111827',
          secondary: '#6B7280',
          tertiary: 'rgba(0, 0, 0, 0.4)',
        },
        // Handwritten fonts only for gifts/letters
        handwritten: {
          DEFAULT: '#D4A5A5',
        },
      },
      fontFamily: {
        // System font stack (Inter-based)
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
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

