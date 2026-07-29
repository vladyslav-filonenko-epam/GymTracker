import { createStyles } from 'src/shared/utils';

export const useStyles = createStyles(({ colors, spacing, radius, typography }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: spacing.lg,
  },
  logoArea: {
    alignItems: 'center' as const,
    marginBottom: spacing.huge,
  },
  logoRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.sm,
  },
  logoText: {
    ...typography.display.sm,
    color: colors.text.primary,
    letterSpacing: 4,
    marginLeft: spacing.sm,
    textTransform: 'uppercase' as const,
  },
  subtitle: {
    ...typography.label,
    color: colors.text.secondary,
    letterSpacing: 3,
    marginTop: spacing.xs,
    textTransform: 'uppercase' as const,
  },
  dotsContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    marginBottom: spacing.huge,
    gap: spacing.md,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: radius.full,
    borderWidth: 2,
  },
  numpad: {
    width: '100%' as const,
    maxWidth: 320,
  },
  numpadRow: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  numpadKey: {
    flex: 1,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.overlay.subtle,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  numpadKeyEmpty: {
    flex: 1,
    height: 64,
  },
  numpadKeyText: {
    ...typography.display.md,
    color: colors.text.primary,
  },
  numpadDeleteText: {
    ...typography.heading.md,
    color: colors.text.primary,
  },
}));
