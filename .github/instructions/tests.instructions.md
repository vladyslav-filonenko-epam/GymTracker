---
applyTo:
  - "**/__tests__/**"
  - "**/*.test.{ts,tsx}"
  - "**/*.spec.{ts,tsx}"
---

# Testing Instructions

## What NOT to test

**Static data files must never have test files.** A file that only exports plain `as const` objects with no logic (e.g. `colors.ts`, `tokens.ts`, `constants.ts`) has nothing to test — any assertion would just duplicate the source. Skip test files for these entirely.

Files that **do** need tests: anything with logic, conditions, side effects, or behaviour — stores, hooks, components, utilities, repositories.

## Stack
- **Jest** — test runner (configured in `jest.config.js`)
- **jest.setup.ts** — global test setup (runs before every test file; add global mocks/config here)
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

Source: src/features/workout/components/WorkoutCard/WorkoutCard.tsx
Test:   src/features/workout/components/WorkoutCard/__tests__/WorkoutCard.test.tsx

Source: src/features/workout/components/WorkoutCard/helpers.ts
Test:   src/features/workout/components/WorkoutCard/__tests__/helpers.test.ts
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
Use `renderHook` and `act` from `@testing-library/react-native`. Aim to cover initial state, each action, async loading transitions, and error handling:
```ts
// src/features/workout/hooks/__tests__/use-workout-form.test.ts
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
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should set error when submitting empty name', async () => {
    // Arrange
    const { result } = renderHook(() => useWorkoutForm());

    // Act
    await act(async () => {
      await result.current.submit();
    });

    // Assert
    expect(result.current.error).toBe('Name is required');
  });
});
```

## Helper Tests
Every helper must be tested for happy path, edge cases, and error cases:
```ts
// src/shared/utils/__tests__/format-weight.test.ts
import { formatWeight } from '../format-weight';

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
    expect(formatWeight(0)).toBe('0 kg');
  });
});
```

## Standard Mocks
```ts
// MMKV
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => {
    const store = new Map<string, unknown>();

    return {
      set: (k: string, v: unknown) => store.set(k, v),
      getString: (k: string) => store.get(k) as string | undefined,
      getBoolean: (k: string) => store.get(k) as boolean | undefined,
      delete: (k: string) => store.delete(k),
    };
  }),
}));

// Keychain
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn().mockResolvedValue(true),
  getGenericPassword: jest.fn().mockResolvedValue({ password: 'hashed_pin' }),
  resetGenericPassword: jest.fn().mockResolvedValue(true),
}));

// Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn(), replace: jest.fn() }),
  useRoute: () => ({ params: {} }),
}));

// Biometrics
jest.mock('react-native-biometrics', () => ({
  default: jest.fn(() => ({
    isSensorAvailable: jest.fn().mockResolvedValue({ available: true, biometryType: 'FaceID' }),
    simplePrompt: jest.fn().mockResolvedValue({ success: true }),
  })),
}));
```
