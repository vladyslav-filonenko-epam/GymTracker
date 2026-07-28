import { StyleSheet } from 'react-native';

import type { Colors, Radius, Spacing } from 'src/shared/theme/types';

export const createStyles = (colors: Colors, spacing: Spacing, _radius: Radius, topInset: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg + topInset,
    },
    header: {
      color: colors.text.primary,
      fontSize: 32,
      fontWeight: '700',
      letterSpacing: 1,
      marginBottom: spacing.xxxl,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      color: colors.text.muted,
      fontSize: 16,
    },
  });
