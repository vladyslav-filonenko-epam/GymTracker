import React from 'react';

import { render, screen } from '@testing-library/react-native';

import 'src/shared/localization';

import { ExercisesListScreen } from '../ExercisesListScreen';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('ExercisesListScreen', () => {
  it('should render the "Exercises" header', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    render(<ExercisesListScreen />);

    // Assert
    expect(screen.getByText('Exercises')).toBeTruthy();
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
