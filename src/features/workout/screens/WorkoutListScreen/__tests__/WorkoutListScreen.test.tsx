import React from 'react';

import { render, screen } from '@testing-library/react-native';

import 'src/shared/localization';

import { WorkoutListScreen } from '../WorkoutListScreen';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('WorkoutListScreen', () => {
  it('should render the "Workouts" header', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    render(<WorkoutListScreen />);

    // Assert
    expect(screen.getByText('Workouts')).toBeTruthy();
  });

  it('should render the empty state message', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    render(<WorkoutListScreen />);

    // Assert
    expect(screen.getByText('No workouts yet')).toBeTruthy();
  });

  it('should match the snapshot', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    const { toJSON } = render(<WorkoutListScreen />);

    // Assert
    expect(toJSON()).toMatchSnapshot();
  });
});
