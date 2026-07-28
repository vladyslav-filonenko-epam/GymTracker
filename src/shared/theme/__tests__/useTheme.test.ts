import React from 'react';

import { renderHook } from '@testing-library/react-native';

import { darkColors } from '../colors';
import { ThemeContext } from '../ThemeProvider';
import { radius, spacing, typography } from '../tokens';
import { useTheme } from '../useTheme';

describe('useTheme', () => {
  it('should return the default dark theme context when used outside of a ThemeProvider', () => {
    // Arrange
    // no wrapper provided intentionally

    // Act
    const { result } = renderHook(() => useTheme());

    // Assert
    expect(result.current.theme).toBe('dark');
    expect(result.current.colors).toEqual(darkColors);
    expect(result.current.spacing).toEqual(spacing);
    expect(result.current.radius).toEqual(radius);
  });

  it('should return the value provided by a wrapping ThemeContext.Provider', () => {
    // Arrange
    const customSetTheme = jest.fn();
    const customValue = {
      colors: darkColors,
      spacing,
      radius,
      typography,
      theme: 'light' as const,
      setTheme: customSetTheme,
    };
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ThemeContext.Provider, { value: customValue }, children);

    // Act
    const { result } = renderHook(() => useTheme(), { wrapper });

    // Assert
    expect(result.current.theme).toBe('light');
    expect(result.current.setTheme).toBe(customSetTheme);
  });
});
