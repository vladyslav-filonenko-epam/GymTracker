import { StyleSheet } from 'react-native';

import type { Colors, Radius, Spacing } from 'src/shared/theme/types';

export const createStyles = (
  colors: Colors,
  spacing: Spacing,
  radius: Radius,
  isDark: boolean,
  topInset: number,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg + topInset,
    },
    title: {
      color: colors.text.primary,
      fontSize: 32,
      fontWeight: '700',
      letterSpacing: 1,
      marginBottom: spacing.xxxl,
    },
    sectionHeader: {
      color: colors.text.secondary,
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 2,
      marginBottom: spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    rowLabel: {
      color: colors.text.primary,
      fontSize: 16,
      fontWeight: '400',
    },
    toggle: {
      width: 44,
      height: 24,
      borderRadius: radius.full,
      padding: 2,
      justifyContent: 'center',
      backgroundColor: isDark ? colors.accent.primary : colors.overlay.subtle,
    },
    toggleThumb: {
      width: 20,
      height: 20,
      borderRadius: radius.full,
      backgroundColor: colors.static.white,
    },
  });
