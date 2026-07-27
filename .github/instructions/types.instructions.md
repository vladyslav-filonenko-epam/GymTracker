---
applyTo: "src/**/*.ts, src/**/*.tsx"
---

# Types Instructions

## Where to Define Types
| Scope | Location |
|---|---|
| Props for a component | Inline in the component file (`WorkoutCard.tsx`) |
| Complex internal types for 1 component | `src/features/<name>/components/<Component>/types.ts` or `src/shared/components/<Component>/types.ts` |
| Component API types (variants, enums) exported for consumers | Same component `types.ts`, re-exported via `index.ts` |
| Domain types used within 1 feature | `src/features/<name>/types.ts` |
| Domain types used across 2+ features | `src/shared/types/<file-name>.ts` |
| DB-derived types | Inferred from Drizzle schema via `$inferSelect` / `$inferInsert` |

**Key rule:** if a type *describes a component's API* (props, variants, enums), it lives with the component — not in `src/shared/types/`. Promote to `src/shared/types/` only for domain types that are independent of any component.

## Naming Conventions
- `interface` for object shapes: `WorkoutCardProps`, `Workout`, `Exercise`
- `type` for unions, aliases, mapped types: `Theme`, `MuscleGroup`, `AsyncState<T>`
- No `I` prefix on interfaces — `WorkoutItem` not `IWorkoutItem`
- No `T` prefix on types unless it's a generic parameter

## Props Interface
Always define props as an `interface` directly above the component in the same `.tsx` file:
```tsx
interface WorkoutCardProps {
  workout: Workout;
  isActive?: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}

export const WorkoutCard = ({ workout, isActive = false, onPress }: WorkoutCardProps) => {
  ...
};
```

## Component-Local Types (`types.ts`)
When a component has complex internal types beyond props — or exposes variants/enums as part of its API — create a `types.ts` inside the component folder:
```ts
// src/shared/components/List/types.ts
export type ListVariant = 'flat' | 'sectioned';

export interface ListSection<T> {
  title: string;
  data: T[];
}
```

Re-export them via the component's `index.ts` so consumers have a clean import path:
```ts
// src/shared/components/List/index.ts
export { List } from './List';
export type { ListVariant, ListSection } from './types';
```

Consumer usage:
```ts
import type { ListVariant } from 'src/shared/components/List';
```

**Never** move component API types to `src/shared/types/` just because the component is shared — the types belong to the component, not to the global type registry.

## Feature Types File (`types.ts`)
Domain types local to a feature — not exported from the DB schema:
```ts
// src/features/workout/types.ts

export interface Workout {
  id: number;
  name: string;
  startedAt: number;
  finishedAt: number | null;
  exerciseCount: number;
  totalSets: number;
}

export interface WorkoutExercise {
  id: number;
  workoutId: number;
  exerciseId: number;
  exerciseName: string;
  sets: WorkoutSet[];
}

export interface WorkoutSet {
  id: number;
  reps: number;
  weight: number;
  isCompleted: boolean;
}
```

## Async State Shape
Use this generic for any loading/error data:
```ts
// src/shared/types/async-state.ts
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
```

## DB-Derived Types
Infer types directly from Drizzle schema — don't duplicate them:
```ts
// src/db/schema/exercises.ts
export const exercises = sqliteTable('exercises', { ... });

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
```

Import `Exercise` and `NewExercise` from the schema — never redefine them manually.

## Unions and Literals
Use `as const` + `typeof` for string literal unions from arrays:
```ts
export const THEMES = ['dark', 'light', 'system'] as const;
export type Theme = typeof THEMES[number]; // 'dark' | 'light' | 'system'
```

## Enums
Enums are defined in `types.ts` files — never inline in component or screen files.

```ts
// src/features/workout/types.ts
export enum MuscleGroup {
  Chest = 'chest',
  Back = 'back',
  Legs = 'legs',
  Shoulders = 'shoulders',
  Arms = 'arms',
  Core = 'core',
}

const group: MuscleGroup = MuscleGroup.Chest;
```

## Rules
- Strict mode is ON — no `any`, use `unknown` when type is truly unknown
- Prefer `interface` for object shapes, `type` for everything else
- No `I` prefix on interfaces
- Never use type assertions (`as SomeType`) to silence type errors — fix the types
- Export types with `export type` — not `export`
- All function params and return values must be explicitly typed
