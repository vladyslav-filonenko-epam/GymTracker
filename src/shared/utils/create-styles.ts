import { useContext, useMemo } from 'react';

import { StyleSheet } from 'react-native';

import { ThemeContext } from 'src/shared/theme/ThemeProvider';
import { typography as baseTypography } from 'src/shared/theme/tokens';
import type { Colors, Radius, Spacing, Typography, TypographyToken } from 'src/shared/theme/types';

const isToken = (v: unknown): v is TypographyToken =>
  typeof v === 'object' && v !== null && 'fontSize' in v;

const enrichTypography = (obj: Record<string, unknown>, color: string): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      isToken(v)
        ? { ...v, color }
        : typeof v === 'object' && v !== null
          ? enrichTypography(v as Record<string, unknown>, color)
          : v,
    ]),
  );

export interface ThemeProps {
  colors: Colors;
  spacing: Spacing;
  radius: Radius;
  typography: Typography;
  isDark: boolean;
}

export type UseStylesResult<S extends StyleSheet.NamedStyles<S>> = {
  styles: S;
  colors: Colors;
  typography: Typography;
  isDark: boolean;
};

// Conditional type: when no extra props are defined (P = Record<never, never>),
// the returned hook takes no arguments. When props are defined, they are required.
type StylesHook<
  S extends StyleSheet.NamedStyles<S>,
  P extends Record<string, unknown>,
> = keyof P extends never ? () => UseStylesResult<S> : (props: P) => UseStylesResult<S>;

export const createStyles = <
  S extends StyleSheet.NamedStyles<S>,
  P extends Record<string, unknown> = Record<never, never>,
>(
  factory: (theme: ThemeProps, props: P) => S,
): StylesHook<S, P> => {
  const useStylesHook = (props?: P): UseStylesResult<S> => {
    const { colors, spacing, radius, theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';

    return useMemo(() => {
      const typography = enrichTypography(
        baseTypography as unknown as Record<string, unknown>,
        colors.text.primary,
      ) as unknown as Typography;
      const themeProps: ThemeProps = { colors, spacing, radius, typography, isDark };

      return {
        styles: StyleSheet.create(factory(themeProps, (props ?? {}) as P)),
        colors,
        typography,
        isDark,
      };
      // Spread props values so memo recomputes when any individual prop changes.
      // Callers should pass stable primitive values for optimal memoization.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [colors, spacing, radius, isDark, ...Object.values(props ?? {})]);
  };

  return useStylesHook as StylesHook<S, P>;
};
