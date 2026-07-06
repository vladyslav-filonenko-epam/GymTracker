---
applyTo: "src/**"
---

# Zustand Instructions

## Store Structure
One Zustand slice per feature, located inside the feature folder with a barrel `index.ts`:
```
src/features/workout/store/
  workout-store.ts
  index.ts          ← re-exports the slice
```

`index.ts`:
```ts
export { useWorkoutStore } from './workout-store';
```

Import from the store folder — not the slice file directly:
```ts
import { useWorkoutStore } from 'src/features/workout/store';
import { useAuthStore } from 'src/features/auth/store';
```

## Slice Template
```ts
// src/features/workout/store/workout-store.ts
import { create } from 'zustand';

import { workoutsRepository } from 'src/db/repositories/workouts-repository';

import type { Workout } from '../types';

interface WorkoutState {
  workouts: Workout[];
  isLoading: boolean;
  error: string | null;
  fetchWorkouts: () => Promise<void>;
  createWorkout: (name: string) => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>(set => ({
  workouts: [],
  isLoading: false,
  error: null,

  fetchWorkouts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await workoutsRepository.findAll();
      set({ workouts: data, isLoading: false });
    } catch {
      set({ error: 'Failed to load workouts', isLoading: false });
    }
  },

  createWorkout: async name => {
    const workout = await workoutsRepository.create({ name, startedAt: Date.now() });
    set(state => ({ workouts: [workout, ...state.workouts] }));
  },
}));
```

## Selector Pattern
Zustand hooks can be called in **components, screens, and hooks** — anywhere in the React tree.

Always select the minimum slice of state needed — never select the whole store:
```ts
// ✅ Single value — no useShallow needed
const workouts = useWorkoutStore(state => state.workouts);

// ❌ Whole store — re-renders on any change
const store = useWorkoutStore();
```

## useShallow — Selecting Multiple Values
When selecting 2+ values, wrap with `useShallow` to prevent unnecessary re-renders:
```ts
import { useShallow } from 'zustand/react/shallow';

// ❌ Without useShallow — new object reference every render, always re-renders
const { workouts, isLoading } = useWorkoutStore(state => ({
  workouts: state.workouts,
  isLoading: state.isLoading,
}));

// ✅ With useShallow — shallow compares values, only re-renders when they actually change
const { workouts, isLoading } = useWorkoutStore(
  useShallow(state => ({
    workouts: state.workouts,
    isLoading: state.isLoading,
  }))
);
```

**Rule:** 1 value → plain selector. 2+ values → always `useShallow`.

## Actions
Actions are stable references — no `useShallow` needed:
```ts
const fetchWorkouts = useWorkoutStore(state => state.fetchWorkouts);
const createWorkout = useWorkoutStore(state => state.createWorkout);
```

## Rules
- Actions call repositories then update local state — never call repositories directly from components
- Never expose raw Drizzle types from the store — map to domain types first
- Async state shape: `{ data, isLoading, error }` — always initialise `error: null` and `isLoading: false`
- Never store the raw PIN — hash it before storing via Keychain
