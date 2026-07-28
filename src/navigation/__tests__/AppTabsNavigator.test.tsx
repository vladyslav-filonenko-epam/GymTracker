import React from 'react';

import { render } from '@testing-library/react-native';

import { AppTabsNavigator } from '../AppTabsNavigator';

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: () => null,
  }),
}));

jest.mock('src/shared/icons', () => ({
  DumbbellIcon: () => null,
  ListChecksIcon: () => null,
  SettingsIcon: () => null,
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
    setTheme: jest.fn(),
  }),
}));

jest.mock('../WorkoutNavigator', () => ({
  WorkoutNavigator: () => null,
}));

jest.mock('../ExercisesNavigator', () => ({
  ExercisesNavigator: () => null,
}));

jest.mock('../SettingsNavigator', () => ({
  SettingsNavigator: () => null,
}));

describe('AppTabsNavigator', () => {
  it('should render without crashing', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    const { toJSON } = render(<AppTabsNavigator />);

    // Assert
    expect(toJSON()).toBeDefined();
  });

  it('should match the snapshot', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    const { toJSON } = render(<AppTabsNavigator />);

    // Assert
    expect(toJSON()).toMatchSnapshot();
  });
});
