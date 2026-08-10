import type { ReactNode } from 'react';

import { render } from '@testing-library/react-native';

import { AppTabsNavigator } from '../AppTabsNavigator';

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }: { children: ReactNode }) => children,
    Screen: () => null,
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
