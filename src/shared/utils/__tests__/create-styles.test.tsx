import React from 'react';

import { renderHook } from '@testing-library/react-native';

import { darkColors, lightColors } from 'src/shared/theme/colors';
// ThemeContext must be imported directly (not from the barrel) to avoid the
// utils ↔ theme circular dependency that makes ThemeContext undefined in tests.
import { ThemeContext } from 'src/shared/theme/ThemeProvider';
import { radius, spacing, typography } from 'src/shared/theme/tokens';
import type { Theme, Typography } from 'src/shared/theme/types';

import { createStyles, enrichTypography } from '../create-styles';
import type { ThemeProps } from '../create-styles';

const darkTypography = enrichTypography(
  typography as unknown as Record<string, unknown>,
  darkColors.text.primary,
) as unknown as Typography;

const buildThemeValue = (theme: 'dark' | 'light'): Theme => ({
  colors: theme === 'dark' ? darkColors : lightColors,
  spacing,
  radius,
  typography,
  theme,
  setTheme: jest.fn(),
});

const createWrapper = (theme: 'dark' | 'light') => {
  const value = buildThemeValue(theme);

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );

  return Wrapper;
};

describe('createStyles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the factory with the correct ThemeProps', () => {
    // Arrange
    const factory = jest.fn((theme: ThemeProps) => ({
      container: { backgroundColor: theme.colors.background.primary },
    }));
    const useMyStyles = createStyles(factory);

    // Act
    renderHook(() => useMyStyles(), { wrapper: createWrapper('dark') });

    // Assert
    expect(factory).toHaveBeenCalledWith(
      {
        colors: darkColors,
        spacing,
        radius,
        typography: darkTypography,
        isDark: true,
      },
      {},
    );
  });

  it('should return the computed styles object along with colors, typography and isDark', () => {
    // Arrange
    const factory = (theme: ThemeProps) => ({
      container: { backgroundColor: theme.colors.background.primary },
    });
    const useMyStyles = createStyles(factory);

    // Act
    const { result } = renderHook(() => useMyStyles(), { wrapper: createWrapper('dark') });

    // Assert
    expect(result.current.styles.container).toEqual({
      backgroundColor: darkColors.background.primary,
    });
    expect(result.current.colors).toEqual(darkColors);
    expect(result.current.typography).toEqual(darkTypography);
    expect(result.current.isDark).toBe(true);
  });

  it('should recompute the styles when the theme changes', () => {
    // Arrange
    const factory = jest.fn((theme: ThemeProps) => ({
      container: { backgroundColor: theme.colors.background.primary },
    }));
    const useMyStyles = createStyles(factory);

    const { result: darkResult } = renderHook(() => useMyStyles(), {
      wrapper: createWrapper('dark'),
    });
    const callCountAfterDarkRender = factory.mock.calls.length;

    // Act
    const { result: lightResult } = renderHook(() => useMyStyles(), {
      wrapper: createWrapper('light'),
    });

    // Assert
    expect(darkResult.current.isDark).toBe(true);
    expect(factory.mock.calls.length).toBeGreaterThan(callCountAfterDarkRender);
    expect(lightResult.current.isDark).toBe(false);
    expect(lightResult.current.styles.container).toEqual({
      backgroundColor: lightColors.background.primary,
    });
  });

  it('should recompute the styles when props change', () => {
    // Arrange
    const factory = jest.fn((_theme: ThemeProps, { dep }: { dep: number }) => ({
      container: { margin: dep },
    }));
    const useMyStyles = createStyles(factory);
    const wrapper = createWrapper('dark');

    const { rerender } = renderHook(({ dep }: { dep: number }) => useMyStyles({ dep }), {
      wrapper,
      initialProps: { dep: 1 },
    });

    const callCountBeforePropsChange = factory.mock.calls.length;

    // Act
    rerender({ dep: 2 });

    // Assert
    expect(factory.mock.calls.length).toBe(callCountBeforePropsChange + 1);
  });

  it('should not recompute the styles when props and theme are unchanged', () => {
    // Arrange
    const factory = jest.fn((_theme: ThemeProps, { dep }: { dep: number }) => ({
      container: { margin: dep },
    }));
    const useMyStyles = createStyles(factory);
    const wrapper = createWrapper('dark');

    const { rerender } = renderHook(({ dep }: { dep: number }) => useMyStyles({ dep }), {
      wrapper,
      initialProps: { dep: 1 },
    });

    const callCountBeforeRerender = factory.mock.calls.length;

    // Act
    rerender({ dep: 1 });

    // Assert
    expect(factory.mock.calls.length).toBe(callCountBeforeRerender);
  });
});
