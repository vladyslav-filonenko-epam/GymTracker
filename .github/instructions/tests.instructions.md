---
applyTo:
  - "**/__tests__/**"
  - "**/*.test.{ts,tsx}"
  - "**/*.spec.{ts,tsx}"
---

# Testing Instructions

## Stack
- **Jest** — test runner (configured in `jest.config.js`)
- **`jest.setup.ts`** — global test setup (runs before every test file). Check this file to see what is already globally mocked — do **not** re-mock those modules in individual test files.
- **@testing-library/react-native** — component and hook testing (also used for snapshots)
- **jest-extended** — additional matchers

## Principles

### AAA Pattern (mandatory in every test)
```ts
it('should return formatted weight', () => {
  // Arrange
  const weightKg = 100;

  // Act
  const result = formatWeight(weightKg);

  // Assert
  expect(result).toBe('100 kg');
});
```

### FIRST Principles
- **Fast** — mock all I/O (DB, MMKV, Keychain, biometrics, network)
- **Independent** — no shared state between tests; `beforeEach(() => jest.clearAllMocks())`
- **Repeatable** — mock `Date.now()` and `Math.random()` when used
- **Self-validating** — every test has explicit `expect` statements
- **Timely** — write tests alongside implementation, not after

## File Location Convention
Tests live in a `__tests__/` folder next to the file they test:
```
Source: src/features/auth/hooks/use-pincode.ts
Test:   src/features/auth/hooks/__tests__/use-pincode.test.ts
```

## Snapshot Tests
Use `render` from `@testing-library/react-native` for all snapshot tests:
```tsx
import { render } from '@testing-library/react-native';

it('renders correctly', () => {
  const { toJSON } = render(<WorkoutCard workout={mockWorkout} onPress={jest.fn()} />);

  expect(toJSON()).toMatchSnapshot();
});
```

## Hook Tests
Use `renderHook` and `act` from `@testing-library/react-native`. Cover: initial state, each action, async loading transitions, and error handling:
```ts
import { act, renderHook } from '@testing-library/react-native';

import { useWorkoutForm } from '../use-workout-form';

jest.mock('src/features/workout/store/workout-store');

describe('useWorkoutForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have empty name and no error initially', () => {
    // Arrange & Act
    const { result } = renderHook(() => useWorkoutForm());

    // Assert
    expect(result.current.name).toBe('');
    expect(result.current.error).toBeNull();
  });
});
```

## Helper Tests
Every helper must be tested for happy path, edge cases, and error cases:
```ts
describe('formatWeight', () => {
  it('should format weight with kg suffix', () => {
    // Arrange
    const weight = 100;

    // Act
    const result = formatWeight(weight);

    // Assert
    expect(result).toBe('100 kg');
  });

  it('should handle zero weight', () => {
    // Arrange
    const weight = 0;

    // Act
    const result = formatWeight(weight);

    // Assert
    expect(result).toBe('0 kg');
  });
});
```

## Store Tests
Use `act` to call store actions. Reset state in `beforeEach` via `store.getState().reset()` or by re-initializing the store:
```ts
import { act, renderHook } from '@testing-library/react-native';

import { useAuthStore } from '../auth-store';

describe('useAuthStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    act(() => useAuthStore.getState().reset());
  });

  it('should set PIN and mark as configured', () => {
    // Arrange & Act
    act(() => useAuthStore.getState().setPin('1234'));

    // Assert
    expect(useAuthStore.getState().isPinConfigured).toBe(true);
  });
});
```

## Standard Mocks
MMKV, Keychain, Navigation (`@react-navigation/native`), and Biometrics are globally mocked in `jest.setup.ts` — no per-test setup needed for these.
