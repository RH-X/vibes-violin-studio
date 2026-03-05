/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mint: {
          50:  '#f0faf5',
          100: '#d8f3e7',
          200: '#b4e7d0',
          300: '#84d3b2',
          DEFAULT: '#84d3b2',
          500: '#5ab898',
          600: '#3d9878',
        },
        lavender: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          DEFAULT: '#c4b5fd',
          500: '#a78bfa',
          600: '#7c3aed',
        },
        peach: {
          50:  '#fff8f3',
          100: '#fde8d8',
          200: '#fbd0b0',
          DEFAULT: '#fbd0b0',
          400: '#f9a874',
          500: '#f7854a',
        },
        ink: '#2d2d3a',
        purplePrimary: '#6d3fc1',
        purpleSoft: '#ede9fe',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        card: '1.25rem',
        blob: '60% 40% 50% 60% / 60% 50% 40% 60%',
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(109,63,193,0.08)',
        float: '0 8px 32px 0 rgba(44,44,58,0.10)',
      },
      spacing: {
        section: '5rem',
        'section-sm': '3rem',
      },
    },
  },
  plugins: [],
};
