import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';

import 'src/shared/localization';
import { darkColors, lightColors } from 'src/shared/theme/colors';
// ThemeContext must be imported directly (not from the barrel) to avoid the
// utils ↔ theme circular dependency that makes ThemeContext undefined in tests.
import { ThemeContext } from 'src/shared/theme/ThemeProvider';
import { radius, spacing, typography } from 'src/shared/theme/tokens';

import { SettingsScreen } from '../SettingsScreen';

const mockSetTheme = jest.fn();

// Only useTheme is needed from this module; the component derives isDark via useStyles / ThemeContext.
jest.mock('src/shared/theme', () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
  }),
}));

/**
 * Renders SettingsScreen wrapped in a ThemeContext.Provider so that
 * createStyles-based hooks receive the correct `isDark` value.
 */
const renderWithTheme = (theme: 'dark' | 'light') => {
  const value = {
    colors: theme === 'dark' ? darkColors : lightColors,
    spacing,
    radius,
    typography,
    theme,
    setTheme: mockSetTheme,
  };

  return render(
    <ThemeContext.Provider value={value}>
      <SettingsScreen />
    </ThemeContext.Provider>,
  );
};

const pressToggle = () => {
  fireEvent.press(screen.getByTestId('theme-toggle'));
};

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the settings title and section header', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    renderWithTheme('dark');

    // Assert
    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByText('Preferences')).toBeTruthy();
    expect(screen.getByText('Dark mode')).toBeTruthy();
  });

  it('should call setTheme with "light" when toggled while dark theme is active', () => {
    // Arrange
    renderWithTheme('dark');

    // Act
    pressToggle();

    // Assert
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('should call setTheme with "dark" when toggled while light theme is active', () => {
    // Arrange
    renderWithTheme('light');

    // Act
    pressToggle();

    // Assert
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('should match the snapshot', () => {
    // Arrange & Act
    const { toJSON } = renderWithTheme('dark');

    // Assert
    expect(toJSON()).toMatchSnapshot();
  });
});
