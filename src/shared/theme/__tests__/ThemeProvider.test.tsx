import React from 'react';

import { act, renderHook } from '@testing-library/react-native';

import { storage } from 'src/shared/utils/storage';

import { darkColors, lightColors } from '../colors';
import { ThemeContext, ThemeProvider } from '../ThemeProvider';

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    getBoolean: jest.fn(),
    delete: jest.fn(),
  })),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should default to dark theme when no value is stored', () => {
    // Arrange
    (storage.getString as jest.Mock).mockReturnValue(undefined);

    // Act
    const { result } = renderHook(() => React.useContext(ThemeContext), { wrapper });

    // Assert
    expect(result.current.theme).toBe('dark');
    expect(result.current.colors).toEqual(darkColors);
  });

  it('should restore the light theme when stored value is "light"', () => {
    // Arrange
    (storage.getString as jest.Mock).mockReturnValue('light');

    // Act
    const { result } = renderHook(() => React.useContext(ThemeContext), { wrapper });

    // Assert
    expect(result.current.theme).toBe('light');
    expect(result.current.colors).toEqual(lightColors);
  });

  it('should default to dark theme when the stored value is invalid', () => {
    // Arrange
    (storage.getString as jest.Mock).mockReturnValue('not-a-theme');

    // Act
    const { result } = renderHook(() => React.useContext(ThemeContext), { wrapper });

    // Assert
    expect(result.current.theme).toBe('dark');
  });

  it('should persist the new theme and update context value when setTheme is called', () => {
    // Arrange
    (storage.getString as jest.Mock).mockReturnValue('dark');
    const { result } = renderHook(() => React.useContext(ThemeContext), { wrapper });

    // Act
    act(() => {
      result.current.setTheme('light');
    });

    // Assert
    expect(storage.set).toHaveBeenCalledWith('theme', 'light');
    expect(result.current.theme).toBe('light');
    expect(result.current.colors).toEqual(lightColors);
  });
});
