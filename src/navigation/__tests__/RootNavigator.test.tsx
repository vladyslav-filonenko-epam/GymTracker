import type { ComponentType, ReactNode } from 'react';

import { render, screen } from '@testing-library/react-native';

import { RootNavigator } from '../RootNavigator';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn(), replace: jest.fn() }),
  useRoute: () => ({ params: {} }),
  NavigationContainer: ({ children }: { children: ReactNode }) => children,
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: { children: ReactNode }) => children,
    Screen: ({ component: Component }: { component: ComponentType }) => <Component />,
  }),
}));

jest.mock('../AppTabsNavigator', () => ({
  AppTabsNavigator: () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Text } = require('react-native');

    return <Text>APP_TABS_NAVIGATOR</Text>;
  },
}));

jest.mock('../AuthStackNavigator', () => ({
  AuthStackNavigator: () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Text } = require('react-native');

    return <Text>AUTH_STACK_NAVIGATOR</Text>;
  },
}));

let mockIsAuthenticated = false;

jest.mock('src/features/auth/store', () => ({
  useAuthStore: (selector: (state: unknown) => unknown) =>
    selector({ isAuthenticated: mockIsAuthenticated }),
}));

describe('RootNavigator', () => {
  beforeEach(() => {
    mockIsAuthenticated = false;
  });

  it('should render AuthStackNavigator when the user is not authenticated', () => {
    // Arrange
    mockIsAuthenticated = false;

    // Act
    render(<RootNavigator />);

    // Assert
    expect(screen.getByText('AUTH_STACK_NAVIGATOR')).toBeTruthy();
    expect(screen.queryByText('APP_TABS_NAVIGATOR')).toBeNull();
  });

  it('should render AppTabsNavigator when the user is authenticated', () => {
    // Arrange
    mockIsAuthenticated = true;

    // Act
    render(<RootNavigator />);

    // Assert
    expect(screen.getByText('APP_TABS_NAVIGATOR')).toBeTruthy();
    expect(screen.queryByText('AUTH_STACK_NAVIGATOR')).toBeNull();
  });
});
