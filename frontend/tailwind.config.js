const colors = require('./src/resources/colors');
const typography = require('./src/resources/typography');
const shadows = require('./src/resources/shadows');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        brand: {
          900: '#0C373B',
          800: '#115553',
          700: '#079D84',
          600: '#079D84',
          500: '#1DDFBD',
          400: '#7EFCF4',
          300: '#7EFCF4',
          200: '#7EFCF4',
          100: '#FAFBFB',
        },
        slate: {
          900: '#010202',
          800: '#0E1716',
          700: '#1E2320',
          600: '#2D332E',
          500: '#49514A',
          400: '#A9B0AF',
          100: '#FAFBFB',
        },
      },
      fontFamily: {
        ...typography.typography.fontFamily,
      },
      fontSize: {
        ...typography.typography.fontSize,
      },
      fontWeight: {
        ...typography.typography.fontWeight,
      },
      lineHeight: {
        ...typography.typography.lineHeight,
      },
      boxShadow: {
        ...shadows.shadows,
      },
    },
  },
  plugins: [],
};
