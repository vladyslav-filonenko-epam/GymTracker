---
mode: agent
description: "Sub-agent — writes unit tests and snapshot tests for a given source file"
tools:
  - codebase
  - editFiles
  - runCommands
---

# Testing Sub-Agent

You write comprehensive tests for every new or modified source file.

## For Each File
1. Create `<same-directory>/__tests__/<filename>.test.ts(x)`
2. Follow AAA pattern strictly (Arrange / Act / Assert)
3. Follow FIRST principles (Fast, Independent, Repeatable, Self-validating, Timely)

## Test Structure
```ts
import { /* subject */ } from '../<filename>';

// Mock all dependencies at the top
jest.mock('react-native-mmkv', () => ({ /* see testing instructions */ }));
jest.mock('react-native-keychain', () => ({ /* see testing instructions */ }));

describe('<FileName>', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('<method or scenario>', () => {
    it('should <expected behavior> when <condition>', () => {
      // Arrange
      const input = ...;

      // Act
      const result = ...;

      // Assert
      expect(result).toBe(...);
    });
  });
});
```

## Coverage Requirements
- **Utilities**: happy path + edge cases (null, empty, boundary) + error cases
- **Hooks**: initial state + each action + async loading + error handling
- **Components**: snapshot + renders with props + user interactions + conditional rendering
- **Repositories**: each CRUD method success + DB error thrown

## After Writing Tests
Run `yarn test --testPathPattern=<path>` to verify all tests pass.
If any test fails, fix the source or the test (whichever is wrong) before finishing.
