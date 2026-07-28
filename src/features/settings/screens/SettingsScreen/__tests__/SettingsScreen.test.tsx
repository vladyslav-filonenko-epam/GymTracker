import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { SettingsScreen } from '../SettingsScreen';

const mockSetThemeContext = jest.fn();

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('zustand/react/shallow', () => ({
  useShallow: (fn: (state: unknown) => unknown) => fn,
}));

jest.mock('src/shared/theme', () => ({
  useTheme: () => ({
    colors: {
      background: { primary: '#0C0C0E', secondary: '#1E1E22', card: '#161618' },
      surface: '#2A2A2F',
      accent: { primary: '#C8FF00', secondary: '#A8D900' },
      text: { primary: '#F0F0F2', secondary: '#888896', muted: '#555560' },
      border: 'rgba(255, 255, 255, 0.08)',
      status: { success: '#4CAF50', error: '#FF3B5C', warning: '#FF9800' },
      overlay: { subtle: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.2)' },
      static: { white: '#FFFFFF', black: '#000000' },
    },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 48, giant: 64 },
    radius: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
    theme: 'dark',
    setTheme: mockSetThemeContext,
  }),
}));

const mockSetTheme = jest.fn();

let mockCurrentTheme: 'dark' | 'light' = 'dark';

jest.mock('src/features/settings/store', () => ({
  useSettingsStore: (selector: (state: unknown) => unknown) =>
    selector({ theme: mockCurrentTheme, setTheme: mockSetTheme }),
}));

const pressToggle = () => {
  fireEvent.press(screen.getByTestId('theme-toggle'));
};

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentTheme = 'dark';
  });

  it('should render the settings title and section header', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    render(<SettingsScreen />);

    // Assert
    expect(screen.getByText('SETTINGS')).toBeTruthy();
    expect(screen.getByText('PREFERENCES')).toBeTruthy();
    expect(screen.getByText('Dark Mode')).toBeTruthy();
  });

  it('should call setTheme with "light" when toggled while dark theme is active', () => {
    // Arrange
    mockCurrentTheme = 'dark';
    render(<SettingsScreen />);

    // Act
    pressToggle();

    // Assert
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('should call setTheme with "dark" when toggled while light theme is active', () => {
    // Arrange
    mockCurrentTheme = 'light';
    render(<SettingsScreen />);

    // Act
    pressToggle();

    // Assert
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('should also update the theme context when toggled', () => {
    // Arrange
    mockCurrentTheme = 'dark';
    render(<SettingsScreen />);

    // Act
    pressToggle();

    // Assert
    expect(mockSetThemeContext).toHaveBeenCalledWith('light');
  });

  it('should match the snapshot', () => {
    // Arrange
    mockCurrentTheme = 'dark';

    // Act
    const { toJSON } = render(<SettingsScreen />);

    // Assert
    expect(toJSON()).toMatchSnapshot();
  });
});
