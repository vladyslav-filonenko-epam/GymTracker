---
applyTo: "src/**"
---

# Zustand Store Rules

- One slice per feature in `src/features/<feature>/store/`, re-exported via `index.ts`
- Import from the barrel: `import { useWorkoutStore } from 'src/features/workout/store'`
- **1 value** → plain selector; **2+ values** → wrap with `useShallow` from `zustand/react/shallow`
- Actions are stable — never use `useShallow` for them
- Never select the whole store: `useWorkoutStore()` — re-renders on any state change
- Actions call repositories, then update state — never call repositories from components
- Never expose raw Drizzle types — map to domain types first
- Async state shape: `{ data: T | null, isLoading: boolean, error: string | null }` — see `zustand` skill for full template
