import { createStyles } from 'src/shared/utils';

export const useStyles = createStyles(({ colors }) => ({
  container: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: colors.background.primary,
  },
}));
