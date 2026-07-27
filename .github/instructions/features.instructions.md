---
applyTo: "src/features/**"
---

# Feature Instructions

## What Is a Feature
A feature is a self-contained vertical slice of app functionality — it owns its UI, state, and data access. Features live in `src/features/<name>/` and communicate with the rest of the app only through their `index.ts` barrel.

## Folder Structure
```
src/features/<name>/
  components/       ← feature-scoped UI components (each in its own PascalCase folder)
    index.ts        ← re-exports all components in this folder
  screens/          ← full screens (each in its own PascalCase folder)
    index.ts        ← re-exports all screens in this folder
  hooks/            ← hooks used by 2+ components within this feature
    index.ts        ← re-exports all hooks in this folder
  utils/            ← pure helpers used by 2+ components within this feature
    index.ts        ← re-exports all utils in this folder
  store/            ← Zustand slice for this feature
    index.ts        ← re-exports the store hook
  constants.ts      ← constants used by 2+ components within this feature
  types.ts          ← TypeScript types local to this feature
  index.ts          ← barrel export — public API of this feature
```

Only create files/folders that will be used — do not create empty files or folders.

`constants.ts` starts as a single file. Promote to a `constants/` folder only when it grows to contain multiple distinct domains of constants.

## Existing Features
| Feature | Path | Responsibility |
|---|---|---|
| `auth` | `src/features/auth/` | PIN entry, biometric auth |
| `workout` | `src/features/workout/` | Workout logging, set/rep tracking |
| `exercises` | `src/features/exercises/` | Exercise library, custom exercises |
| `settings` | `src/features/settings/` | Theme, biometrics toggle |

## Promotion Rule
Start everything inside a component folder. Promote up only when a **second consumer** appears:
- Used by 2+ components in the same feature → promote to `src/features/<name>/hooks|utils|constants/`
- Used by 2+ features → promote to `src/shared/hooks|utils|constants/`

## Zustand Store Slice
Each feature has exactly one Zustand slice in `src/features/<name>/store/` with a barrel `index.ts`. See `zustand.instructions.md` for the full slice template and selector rules.

## Async State Shape
Use this shape for any async data:
```ts
interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}
```

## Barrel Export (`index.ts`)
Only export what other features or navigation need. Keep internals private:
```ts
// src/features/workout/index.ts
export { WorkoutListScreen } from './screens';
export { WorkoutCard } from './components';
export { useWorkoutStore } from './store';
export type { Workout, NewWorkout } from './types';
```

## Types File (`types.ts`)
Local domain types that don't belong in the DB schema:
```ts
// src/features/workout/types.ts
export interface Workout {
  id: number;
  name: string;
  startedAt: number;
  finishedAt: number | null;
  exerciseCount: number;
}
```

## Rules
- Screens are thin — all logic lives in hooks
- Zustand actions call repositories, then update local state
- Never import a feature's internals from outside — only use its `index.ts` exports
- Never import the Drizzle `db` instance outside `src/db/`
