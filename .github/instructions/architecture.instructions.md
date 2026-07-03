---
applyTo: "src/**"
---

# Architecture Instructions

## Feature Module Structure
Every feature in `src/features/<name>/` must contain:
```
<feature>/
  components/   # Feature-scoped UI components (each in its own folder)
  screens/      # Full screens (each in its own folder)
  hooks/        # Hooks used by 2+ components within this feature
  utils/        # Helpers used by 2+ components within this feature
  constants/    # Constants used by 2+ components within this feature
  store/        # Zustand slice for this feature
  types.ts      # TypeScript types local to this feature
  index.ts      # Barrel export (public API of the feature)
```

## Component Folder Structure
Every component and screen lives in its own folder.
Only create optional files when they are actually needed — do not create empty files.
```
WorkoutCard/
  WorkoutCard.tsx        ← component JSX + props (required, PascalCase)
  styles.ts              ← styles factory (required)
  constants.ts           ← component-scoped constants (optional)
  helpers.ts             ← component-scoped pure helpers (optional)
  hooks.ts               ← component-scoped hooks (optional)
  index.ts               ← re-exports the component (required)
  __tests__/
    WorkoutCard.test.tsx   ← unit + snapshot tests
    helpers.test.ts        ← if helpers file exists
    hooks.test.ts          ← if hooks file exists
```
**Naming rule inside a component folder:** only the component file itself is PascalCase (`WorkoutCard.tsx`). All other files are lowercase single-word (`styles.ts`, `constants.ts`, `helpers.ts`, `hooks.ts`, `index.ts`). The folder name provides the context.

Apply this structure to both `components/` and `screens/` folders inside each feature and in `src/shared/components/`.

## Promotion Rule
Start everything inside the component folder. Promote up when a **second consumer** appears:
- Used by 2+ components in the same feature → move to `src/features/<feature>/hooks|utils|constants/`
- Used by 2+ features → move to `src/shared/hooks|utils|constants/`

## State Management
- One Zustand slice per feature, combined in `src/store/index.ts`
- MMKV stores: `biometrics_enabled`, `theme`, `onboarding_complete`, `is_authenticated`, `exercises_seeded`
- Keychain stores: `pincode_hash` — sensitive credential, always use `react-native-keychain` for this
- Never store raw PIN — hash it with a crypto utility before storing
- Zustand actions call repositories then update local state
- Async loading/error state shape:
```ts
interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}
```

## Navigation Structure
```
RootNavigator
 ├── AuthStack (if not authenticated)
 │     └── PincodeScreen
 └── AppTabs (if authenticated)
       ├── WorkoutTab → WorkoutStack
       ├── ExercisesTab → ExercisesStack
       └── SettingsTab → SettingsStack
```
- Type all param lists: `RootStackParamList`, `AppTabParamList`, etc.
- Navigator files live in `src/navigation/`
- Each feature stack is defined in `src/navigation/<Feature>Navigator.tsx`

## Repository Pattern
```ts
// src/db/repositories/workouts-repository.ts
export const workoutsRepository = {
  findAll: async (): Promise<Workout[]> => { ... },
  findById: async (id: number): Promise<Workout | null> => { ... },
  create: async (data: NewWorkout): Promise<Workout> => { ... },
  update: async (id: number, data: Partial<NewWorkout>): Promise<Workout> => { ... },
  delete: async (id: number): Promise<void> => { ... },
};
```
- File names are kebab-case: `workouts-repository.ts`, `exercises-repository.ts`
- Exported const names are camelCase: `workoutsRepository`, `exercisesRepository`
- Repositories return domain types, not raw Drizzle types
- All operations wrap errors as `AppError`
- Never import the Drizzle `db` instance outside of `src/db/`
