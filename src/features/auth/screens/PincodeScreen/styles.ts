import { StyleSheet } from 'react-native';

import type { Colors, Radius, Spacing } from 'src/shared/theme/types';

export const createStyles = (colors: Colors, spacing: Spacing, radius: Radius) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
    },
    logoArea: {
      alignItems: 'center',
      marginBottom: spacing.huge,
    },
    logoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    logoText: {
      color: colors.text.primary,
      fontSize: 20,
      fontWeight: '700',
      letterSpacing: 4,
      marginLeft: spacing.sm,
    },
    subtitle: {
      color: colors.text.secondary,
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 3,
      marginTop: spacing.xs,
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: spacing.huge,
      gap: spacing.md,
    },
    dot: {
      width: 16,
      height: 16,
      borderRadius: radius.full,
      borderWidth: 2,
      borderColor: colors.overlay.border,
    },
    dotFilled: {
      backgroundColor: colors.accent.primary,
      borderColor: colors.accent.primary,
    },
    numpad: {
      width: '100%',
      maxWidth: 320,
    },
    numpadRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    numpadKey: {
      flex: 1,
      height: 64,
      borderRadius: radius.xl,
      backgroundColor: colors.overlay.subtle,
      alignItems: 'center',
      justifyContent: 'center',
    },
    numpadKeyEmpty: {
      flex: 1,
      height: 64,
    },
    numpadKeyText: {
      color: colors.text.primary,
      fontSize: 24,
      fontWeight: '500',
    },
    numpadDeleteText: {
      color: colors.text.primary,
      fontSize: 24,
    },
  });
