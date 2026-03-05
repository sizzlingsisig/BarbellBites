import { createTheme } from '@mantine/core';
import { colors } from './resources/colors';
import { typography } from './resources/typography';
import { shadows } from './resources/shadows';

export const theme = createTheme({
  colors: {
    brand: [
      colors.neonHighlight,
      colors.neonHighlight,
      colors.glowTeal,
      colors.glowTeal,
      colors.primaryTeal,
      colors.primaryTeal,
      colors.darkTeal,
      colors.darkTeal,
      colors.deepTeal,
      colors.deepTeal,
    ],
    slate: [
      colors.whiteUI,
      colors.chromeGray,
      colors.textSlate,
      colors.borderSlate,
      colors.cardSlate,
      colors.deepSurface,
      colors.nearBlack,
      colors.nearBlack,
      colors.nearBlack,
      colors.nearBlack,
    ],
  },
  fontFamily: typography.fontFamily.sans,
  headings: {
    fontFamily: typography.fontFamily.heading,
  },
  fontSizes: typography.fontSize,
  shadows: shadows,
});
