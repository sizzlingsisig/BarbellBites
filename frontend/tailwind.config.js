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
