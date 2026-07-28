import type { Radius, Spacing, Typography } from './types';

export const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  giant: 64,
};

export const radius: Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography: Typography = {
  heading: {
    xl: { fontSize: 32, fontWeight: '700' },
    lg: { fontSize: 28, fontWeight: '700' },
    md: { fontSize: 24, fontWeight: '600' },
    sm: { fontSize: 20, fontWeight: '600' },
  },
  body: {
    lg: { fontSize: 18, fontWeight: '400' },
    md: { fontSize: 16, fontWeight: '400' },
    sm: { fontSize: 14, fontWeight: '400' },
  },
  caption: { fontSize: 12, fontWeight: '400' },
  label: { fontSize: 12, fontWeight: '600' },
  display: {
    sm: { fontSize: 20, fontWeight: '700' },
    md: { fontSize: 24, fontWeight: '500' },
  },
};
