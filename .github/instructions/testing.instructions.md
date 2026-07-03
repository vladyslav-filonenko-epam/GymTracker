---
applyTo: "**/__tests__/**, **/*.test.{ts,tsx}, **/*.spec.{ts,tsx}"
---

# Testing Instructions

## Stack
- **Jest** — test runner (configured in `jest.config.js`)
- **@testing-library/react-native** — component and hook testing
- **react-test-renderer** — snapshot testing
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

## Coverage Requirements
| Type | Unit Tests | Snapshot |
|---|---|---|
| Utilities | happy path + edge cases + errors | ❌ |
| Hooks | initial state + each action + error + loading | ❌ |
| Components | renders + interactions + conditionals | ✅ mandatory |
| Screens | renders + interactions + conditionals | ✅ mandatory |
| Repositories | CRUD success + DB error handling | ❌ |

## Snapshot Tests
```tsx
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(<WorkoutCard workout={mockWorkout} onPress={jest.fn()} />).toJSON();
  expect(tree).toMatchSnapshot();
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
