/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/styles/*.{scss, css}',
  ],
  theme: {
    extend: {
      fontFamily: {
        Ubuntu: 'Ubuntu',
        NotoSansTC: 'Noto Sans TC',
      },

      colors: {
        primary: {
          100: '#651FFF',
          200: '#4018AB',
          300: '#7C4EF6',
        },
        secondary: {
          100: '#AD8AF8',
          200: '#7960AD',
          300: '#BDA0F9',
        },
        tertiary: {
          100: '#909DF9',
          200: '#656EAD',
          300: '#A5B1F9',
        },
      },
    },
  },
  plugins: [],
};
