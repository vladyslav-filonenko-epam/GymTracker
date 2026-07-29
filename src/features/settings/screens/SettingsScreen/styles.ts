import { createStyles } from 'src/shared/utils';

export const useStyles = createStyles(
  ({ colors, spacing, radius, typography, isDark }, { topInset }: { topInset: number }) => ({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg + topInset,
    },
    title: {
      ...typography.heading.xl,
      color: colors.text.primary,
      letterSpacing: 1,
      marginBottom: spacing.xxxl,
      textTransform: 'uppercase' as const,
    },
    sectionHeader: {
      ...typography.label,
      color: colors.text.secondary,
      letterSpacing: 2,
      marginBottom: spacing.md,
      textTransform: 'uppercase' as const,
    },
    row: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    rowLabel: {
      ...typography.body.md,
      color: colors.text.primary,
    },
    toggle: {
      width: 44,
      height: 24,
      borderRadius: radius.full,
      padding: 2,
      justifyContent: 'center' as const,
      backgroundColor: isDark ? colors.accent.primary : colors.overlay.subtle,
    },
    toggleThumb: {
      width: 20,
      height: 20,
      borderRadius: radius.full,
      backgroundColor: colors.static.white,
    },
  }),
);
