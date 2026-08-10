---
name: unit-testing
description: 'Provides the GymTracker unit-testing conventions and workflow; use whenever creating, modifying, or verifying test files.'
---

# Unit Testing — GymTracker

## What NOT to Test
Static `as const` data files with no logic (`colors.ts`, `tokens.ts`, `constants.ts`) — never add test files for these.

Files that **do** need tests: stores, hooks, components, utilities, repositories — anything with logic, conditions, side effects, or behaviour.

## Conventions
All conventions (AAA pattern, FIRST principles, file location, stack) are defined in `tests.instructions.md`.

## By Test Type

**Components** — `render` + `toMatchSnapshot()` for renders; `fireEvent` for interactions.

**Hooks** — `renderHook` + `act`. Cover: initial state, each action, async loading, error handling.

**Stores** — `act` to call actions; reset state in `beforeEach` via `store.getState().reset()`.

**Helpers** — cover happy path, edge cases, and error cases.

**Repositories** — mock the DB; test each method's SQL outcome.

## Standard Mocks
Check `jest.setup.ts` to see what is already globally mocked. Add a new mock there only when it is needed across most test files — not for one-off cases.
