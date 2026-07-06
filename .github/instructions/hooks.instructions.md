---
applyTo: "src/**/hooks.ts, src/**/hooks/**"
---

# Hooks Instructions

## What Is a Hook
A hook encapsulates **stateful logic, side effects, and data fetching**. Hooks keep screens and components thin by extracting all non-JSX logic into reusable, testable units.

## Where to Place Hooks
| Scope | Location |
|---|---|
| Used by 1 component only | `src/features/<name>/components/<Component>/hooks.ts` |
| Used by 2+ components in the same feature | `src/features/<name>/hooks/<hook-name>.ts` |
| Used by 2+ features | `src/shared/hooks/<hook-name>.ts` |

Promote up only when a **second consumer** appears.

## File Naming
- Inside a component folder: `hooks.ts` (lowercase single-word)
- In feature/shared hooks: `kebab-case.ts` — e.g. `use-workout-form.ts`, `use-biometrics.ts`

## Hook Template
```ts
// src/features/workout/hooks/use-workout-form.ts
import { useState } from 'react';

import { useWorkoutStore } from '../store/workout-store';

interface WorkoutFormState {
  name: string;
  isSubmitting: boolean;
  error: string | null;
}

export const useWorkoutForm = () => {
  const createWorkout = useWorkoutStore(state => state.createWorkout);

  const [state, setState] = useState<WorkoutFormState>({
    name: '',
    isSubmitting: false,
    error: null,
  });

  const setName = (name: string) => setState(prev => ({ ...prev, name }));

  const submit = async () => {
    if (!state.name.trim()) {
      setState(prev => ({ ...prev, error: 'Name is required' }));
      return;
    }

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));
    try {
      await createWorkout(state.name.trim());
    } catch {
      setState(prev => ({ ...prev, error: 'Failed to create workout', isSubmitting: false }));
    }
  };

  return { ...state, setName, submit };
};
```

## Naming Convention
All hooks must start with `use` prefix in camelCase:
- `useWorkoutStore`
- `useWorkoutForm`
- `useBiometrics`
- `usePincode`

## Async Loading Pattern
Use this shape when a hook fetches data:
```ts
const [data, setData] = useState<Workout[] | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetch = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const result = await workoutsRepository.findAll();
    setData(result);
  } catch {
    setError('Failed to load workouts');
  } finally {
    setIsLoading(false);
  }
};
```

## Rules
- Arrow functions only — no `function` declarations
- Named exports only — no `export default`
- Export on the same line as declaration
- Hooks must only be called at the top level — never inside loops, conditions, or nested functions
- Never call repositories directly from components — always go through a hook

## What Belongs in Hooks (vs Helpers)
| Logic type | Goes in |
|---|---|
| Read/write Zustand state | `hooks.ts` |
| Call a repository | `hooks.ts` |
| Side effects (`useEffect`) | `hooks.ts` |
| Form state management | `hooks.ts` |
| Format a value for display | `helpers.ts` |
| Pure calculation | `helpers.ts` |
| Data transformation | `helpers.ts` |
