---
applyTo: "src/**/constants.ts, src/**/constants/**"
---

# Constants Instructions

## What Is a Constant
A constant is a **static, immutable value** that is used in multiple places or gives a magic number/string a meaningful name. Constants never change at runtime.

## Where to Place Constants
| Scope | Location |
|---|---|
| Used by 1 screen only | `src/features/<name>/screens/<Screen>/constants.ts` |
| Used by 1 component only | `src/features/<name>/components/<Component>/constants.ts` |
| Used by 2+ components in the same feature | `src/features/<name>/constants.ts` |
| Used by 2+ features | `src/shared/constants.ts` |

Promote up only when a **second consumer** appears.

## File vs Folder
Constants start as a **single file** (`constants.ts`). Promote to a **folder** only when it grows to contain multiple distinct domains of constants:

```
# Start with a file
src/features/workout/constants.ts

# Promote to folder only when domains diverge
src/features/workout/constants/
  workout-limits.ts    ← MAX_SETS, MAX_REPS
  animations.ts        ← durations, easing values
```

## File Naming
- Inside a component folder: `constants.ts` (lowercase single-word)
- In a constants folder: `kebab-case.ts` — e.g. `workout-limits.ts`, `mmkv-keys.ts`

## Naming Convention
Constants use `SCREAMING_SNAKE_CASE`:
```ts
export const MAX_SETS = 20;
export const MAX_REPS = 999;
export const MAX_WEIGHT_KG = 999;
export const MIN_PIN_LENGTH = 4;
export const MAX_PIN_LENGTH = 6;
```

## MMKV Storage Keys
All MMKV keys are defined in one place — `src/shared/constants/mmkv-keys.ts`:
```ts
export const MMKV_KEYS = {
  BIOMETRICS_ENABLED: 'biometrics_enabled',
  THEME: 'theme',
  IS_AUTHENTICATED: 'is_authenticated',
  EXERCISES_SEEDED: 'exercises_seeded',
} as const;
```

Always import from this file — never write MMKV key strings inline anywhere else.

## Rules
- Named exports only — no `export default`
- `SCREAMING_SNAKE_CASE` for all constant names
- No computed values — constants must be static literals or `as const` objects
- Group related constants in the same file
- Never write magic numbers or magic strings inline in components — always reference a named constant
- `as const` on objects to get literal types:
  ```ts
  export const MUSCLE_GROUPS = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'] as const;
  export type MuscleGroup = typeof MUSCLE_GROUPS[number];
  ```
