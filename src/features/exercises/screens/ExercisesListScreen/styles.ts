import { createStyles } from 'src/shared/utils';

export const useStyles = createStyles(
  ({ colors, spacing, typography }, { topInset }: { topInset: number }) => ({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg + topInset,
    },
    header: {
      ...typography.heading.xl,
      color: colors.text.primary,
      letterSpacing: 1,
      marginBottom: spacing.xxxl,
      textTransform: 'uppercase' as const,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    emptyText: {
      ...typography.body.md,
      color: colors.text.muted,
    },
    loader: {
      flex: 1,
    },
  }),
);
