// src/shared/utils/create-styles.ts
// ARCHITECTURAL EXCEPTION: This file contains React hook logic inside a factory function.
// createStyles returns a custom hook. It is the only hook-producing utility in src/shared/utils/
// because it is fundamentally tied to the theme system and must call useContext + useMemo.
//
// DESIGN DECISION: The returned hook also surfaces { colors, typography, isDark } so that
// components can avoid a separate useTheme() call for non-style uses (e.g. SVG icon color props).
import { useContext, useMemo } from 'react';

import { StyleSheet } from 'react-native';

import { ThemeContext } from 'src/shared/theme/ThemeProvider';
import { typography } from 'src/shared/theme/tokens';
import type { Colors, Radius, Spacing, Typography } from 'src/shared/theme/types';

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
