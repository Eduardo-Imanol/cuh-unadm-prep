import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B132B',
          light: '#1C2541',
          dark: '#060B18',
        },
        emerald: {
          DEFAULT: '#10B981',
        },
        surface: {
          DEFAULT: '#FAFAFA',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 20px 25px -5px rgb(15 23 42 / 0.05), 0 8px 10px -6px rgb(15 23 42 / 0.05)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
