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
    },
  },
  plugins: [],
};
