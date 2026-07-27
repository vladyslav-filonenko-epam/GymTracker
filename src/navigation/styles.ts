import { StyleSheet } from 'react-native';

import type { Colors, Radius, Spacing } from 'src/shared/theme';

export const createStyles = (colors: Colors, spacing: Spacing, _radius: Radius) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: colors.background.secondary,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingBottom: spacing.sm,
      paddingTop: spacing.sm,
    },
    tabBarLabel: {
      fontSize: 10,
      textTransform: 'uppercase' as const,
    },
  });
