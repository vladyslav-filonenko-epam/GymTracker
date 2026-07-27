import React from 'react';

import { render, screen } from '@testing-library/react-native';

import { ExercisesListScreen } from '../ExercisesListScreen';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
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

describe('ExercisesListScreen', () => {
  it('should render the "EXERCISES" header', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    render(<ExercisesListScreen />);

    // Assert
    expect(screen.getByText('EXERCISES')).toBeTruthy();
  });

  it('should render the empty state message', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    render(<ExercisesListScreen />);

    // Assert
    expect(screen.getByText('No exercises yet')).toBeTruthy();
  });

  it('should match the snapshot', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    const { toJSON } = render(<ExercisesListScreen />);

    // Assert
    expect(toJSON()).toMatchSnapshot();
  });
});
