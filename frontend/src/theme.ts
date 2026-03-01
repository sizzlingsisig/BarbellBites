import { createTheme } from '@mantine/core';
import { colors } from './resources/colors';
import { typography } from './resources/typography';
import { shadows } from './resources/shadows';

export const theme = createTheme({
  colors: {
    brand: [
      colors.primaryTeal,
      colors.glowTeal,
      colors.deepTeal,
      colors.darkTeal,
      colors.neonHighlight,
      colors.whiteUI,
      colors.cardSlate,
      colors.borderSlate,
      colors.chromeGray,
      colors.textSlate,
    ],
  },
  fontFamily: typography.fontFamily.sans,
  headings: {
    fontFamily: typography.fontFamily.heading,
  },
  fontSizes: typography.fontSize,
  shadows: shadows,
});
