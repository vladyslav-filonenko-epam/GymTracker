---
name: zustand
description: 'GymTracker Zustand v5 store conventions. Use when creating, modifying, or reviewing Zustand stores, selectors, or state logic.'
---

# Zustand v5 — GymTracker

## Store Location
One slice per feature, inside the feature folder with a barrel `index.ts`:
```
src/features/workout/store/
  workout-store.ts
  index.ts          ← re-exports only
```

Always import from the barrel, never the slice file directly:
```ts
import { useWorkoutStore } from 'src/features/workout/store';
```

## Slice Template
```ts
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

## Async State Shape

Defined in `src/shared/types/async-state.ts` — import from there:
```ts
import type { AsyncState } from 'src/shared/types/async-state';

interface WorkoutState extends AsyncState<Workout[]> {
  fetchWorkouts: () => Promise<void>;
}
```

## Selector Rules

**1 value** — plain selector, no `useShallow`:
```ts
const workouts = useWorkoutStore(state => state.workouts);
```

**2+ values** — always `useShallow` to prevent unnecessary re-renders:
```ts
import { useShallow } from 'zustand/react/shallow';

const { workouts, isLoading } = useWorkoutStore(
  useShallow(state => ({ workouts: state.workouts, isLoading: state.isLoading }))
);
```

**Actions** — stable references, never need `useShallow`:
```ts
const fetchWorkouts = useWorkoutStore(state => state.fetchWorkouts);
```

**Never select the whole store:**
```ts
const store = useWorkoutStore(); // ❌ re-renders on any change
```

