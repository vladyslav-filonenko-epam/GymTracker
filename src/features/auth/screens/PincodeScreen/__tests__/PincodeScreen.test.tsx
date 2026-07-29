import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react-native';

import 'src/shared/localization';

import { PincodeScreen } from '../PincodeScreen';

// Override withTiming to immediately invoke its callback so animation-gated
// logic (e.g. handlePinComplete triggered after last dot fills) works in tests.
jest.mock('react-native-reanimated', () => {
  const reanimated = jest.requireActual<Record<string, unknown>>('react-native-reanimated/mock');

  return {
    ...reanimated,
    withTiming: (toValue: number, _config?: unknown, callback?: (finished: boolean) => void) => {
      callback?.(true);
      return toValue;
    },
  };
});

jest.mock('react-native-worklets', () => ({
  scheduleOnRN: (fn: (...args: unknown[]) => unknown, ...args: unknown[]) => fn(...args),
}));

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: jest.fn(), replace: jest.fn() }),
  useRoute: () => ({ params: {} }),
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('zustand/react/shallow', () => ({
  useShallow: (fn: (state: unknown) => unknown) => fn,
}));

const mockInitAuth = jest.fn().mockResolvedValue(undefined);
const mockSetAuthStep = jest.fn();
const mockSetupPin = jest.fn().mockResolvedValue(undefined);
const mockVerifyPin = jest.fn().mockResolvedValue(true);

let mockAuthStepState: 'create' | 'confirm' | 'verify' = 'create';

jest.mock('src/features/auth/store', () => ({
  useAuthStore: (selector: (state: unknown) => unknown) =>
    selector({
      authStep: mockAuthStepState,
      setAuthStep: mockSetAuthStep,
      setupPin: mockSetupPin,
      verifyPin: mockVerifyPin,
      initAuth: mockInitAuth,
    }),
}));

describe('PincodeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthStepState = 'create';
    mockInitAuth.mockResolvedValue(undefined);
    mockSetupPin.mockResolvedValue(undefined);
    mockVerifyPin.mockResolvedValue(true);
  });

  it('should render the "Create pincode" subtitle when authStep is "create"', () => {
    // Arrange
    mockAuthStepState = 'create';

    // Act
    render(<PincodeScreen />);

    // Assert
    expect(screen.getByText('Create pincode')).toBeTruthy();
    expect(screen.getByText('GymTracker')).toBeTruthy();
  });

  it('should render the "Confirm pincode" subtitle when authStep is "confirm"', () => {
    // Arrange
    mockAuthStepState = 'confirm';

    // Act
    render(<PincodeScreen />);

    // Assert
    expect(screen.getByText('Confirm pincode')).toBeTruthy();
  });

  it('should render the "Enter pincode" subtitle when authStep is "verify"', () => {
    // Arrange
    mockAuthStepState = 'verify';

    // Act
    render(<PincodeScreen />);

    // Assert
    expect(screen.getByText('Enter pincode')).toBeTruthy();
  });

  it('should call initAuth on mount', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    render(<PincodeScreen />);

    // Assert
    expect(mockInitAuth).toHaveBeenCalledTimes(1);
  });

  it('should render all numpad digit keys', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    render(<PincodeScreen />);

    // Assert
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].forEach(digit => {
      expect(screen.getByText(digit)).toBeTruthy();
    });
  });

  it('should call setAuthStep with "confirm" after entering a first full pin during creation', async () => {
    // Arrange
    mockAuthStepState = 'create';
    render(<PincodeScreen />);

    // Act
    fireEvent.press(screen.getByText('1'));
    fireEvent.press(screen.getByText('2'));
    fireEvent.press(screen.getByText('3'));
    fireEvent.press(screen.getByText('4'));

    // Assert
    await screen.findByText('1');
    expect(mockSetAuthStep).toHaveBeenCalledWith('confirm');
  });

  it('should call verifyPin when a full pin is entered during verify step', async () => {
    // Arrange
    mockAuthStepState = 'verify';
    render(<PincodeScreen />);

    // Act
    fireEvent.press(screen.getByText('1'));
    fireEvent.press(screen.getByText('2'));
    fireEvent.press(screen.getByText('3'));
    fireEvent.press(screen.getByText('4'));
    await screen.findByText('1');

    // Assert
    expect(mockVerifyPin).toHaveBeenCalledWith('1234');
  });

  it('should navigate to "App" when verifyPin succeeds', async () => {
    // Arrange
    mockAuthStepState = 'verify';
    mockVerifyPin.mockResolvedValue(true);
    render(<PincodeScreen />);

    // Act
    fireEvent.press(screen.getByText('1'));
    fireEvent.press(screen.getByText('2'));
    fireEvent.press(screen.getByText('3'));
    fireEvent.press(screen.getByText('4'));
    await screen.findByText('1');

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('App');
  });

  it('should not navigate when verifyPin fails', async () => {
    // Arrange
    mockAuthStepState = 'verify';
    mockVerifyPin.mockResolvedValue(false);
    jest.useFakeTimers();
    render(<PincodeScreen />);

    // Act
    fireEvent.press(screen.getByText('1'));
    fireEvent.press(screen.getByText('2'));
    fireEvent.press(screen.getByText('3'));
    await act(async () => {
      fireEvent.press(screen.getByText('4'));
      await Promise.resolve();
      await Promise.resolve();
    });
    act(() => {
      jest.runAllTimers();
    });
    jest.useRealTimers();

    // Assert
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should call setupPin and navigate when confirmed pin matches the first pin', async () => {
    // Arrange — make setAuthStep mutate the mock state so re-render sees 'confirm'
    mockSetAuthStep.mockImplementation((step: 'create' | 'confirm' | 'verify') => {
      mockAuthStepState = step;
    });
    mockAuthStepState = 'create';

    render(<PincodeScreen />);

    // Act — enter first PIN in create step (no act wrapper so each press flushes state)
    fireEvent.press(screen.getByText('1'));
    fireEvent.press(screen.getByText('2'));
    fireEvent.press(screen.getByText('3'));
    fireEvent.press(screen.getByText('4'));

    // Wait for component to transition to confirm step
    await screen.findByText('Confirm pincode');

    // Enter same PIN in confirm step
    fireEvent.press(screen.getByText('1'));
    fireEvent.press(screen.getByText('2'));
    fireEvent.press(screen.getByText('3'));
    fireEvent.press(screen.getByText('4'));

    // Wait for async setupPin to complete
    await screen.findByText('Confirm pincode');

    // Assert
    expect(mockSetupPin).toHaveBeenCalledWith('1234');
    expect(mockNavigate).toHaveBeenCalledWith('App');
  });

  it('should not call setupPin and should reset to create when confirmed pin does not match', async () => {
    // Arrange — make setAuthStep mutate the mock state so re-render sees 'confirm'
    jest.useFakeTimers();
    mockSetAuthStep.mockImplementation((step: 'create' | 'confirm' | 'verify') => {
      mockAuthStepState = step;
    });
    mockAuthStepState = 'create';

    render(<PincodeScreen />);

    // Act — enter first PIN (create step): 1234
    fireEvent.press(screen.getByText('1'));
    fireEvent.press(screen.getByText('2'));
    fireEvent.press(screen.getByText('3'));
    fireEvent.press(screen.getByText('4'));

    // Wait for component to transition to confirm step
    await screen.findByText('Confirm pincode');

    // Enter a different PIN (confirm step): 5678
    fireEvent.press(screen.getByText('5'));
    fireEvent.press(screen.getByText('6'));
    fireEvent.press(screen.getByText('7'));
    fireEvent.press(screen.getByText('8'));

    // Run timers for shake animation (600 ms) and any setTimeout calls
    act(() => {
      jest.runAllTimers();
    });
    jest.useRealTimers();

    // Assert
    expect(mockSetupPin).not.toHaveBeenCalled();
    expect(mockSetAuthStep).toHaveBeenCalledWith('create');
  });

  it('should match the snapshot', () => {
    // Arrange
    mockAuthStepState = 'create';

    // Act
    const { toJSON } = render(<PincodeScreen />);

    // Assert
    expect(toJSON()).toMatchSnapshot();
  });
});
