import { createStyles } from 'src/shared/utils';

export const useStyles = createStyles(({ colors, spacing, typography }) => ({
  tabBar: {
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
  },
  tabBarLabel: {
    ...typography.caption,
    textTransform: 'uppercase' as const,
  },
}));
