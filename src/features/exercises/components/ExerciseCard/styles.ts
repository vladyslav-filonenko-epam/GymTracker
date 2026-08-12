import { createStyles } from 'src/shared/utils';

export const useStyles = createStyles(({ colors, spacing, radius, typography }) => ({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  textBlock: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    ...typography.heading.sm,
    color: colors.text.primary,
  },
  muscles: {
    ...typography.body.sm,
    color: colors.text.secondary,
  },
  caption: {
    ...typography.caption,
    color: colors.text.muted,
  },
}));
