---
applyTo: "src/navigation/**"
---

# Navigation Instructions

## Stack
- **React Navigation v7** — `@react-navigation/native-stack` + `@react-navigation/bottom-tabs`
- All navigator files live in `src/navigation/`

## Navigator Structure
```
RootNavigator        ← src/navigation/RootNavigator.tsx
 ├── AuthStack       ← shown when user is NOT authenticated
 │     └── PincodeScreen
 └── AppTabs         ← shown when user IS authenticated
       ├── WorkoutTab    → WorkoutNavigator.tsx
       ├── ExercisesTab  → ExercisesNavigator.tsx
       └── SettingsTab   → SettingsNavigator.tsx
```

## File Naming
| File | Convention | Example |
|---|---|---|
| Navigator files | PascalCase + Navigator suffix | `WorkoutNavigator.tsx` |
| Param list types | PascalCase + ParamList suffix | `WorkoutStackParamList` |

## Param List Typing
Every navigator must have a fully typed param list exported from the same file:
```ts
export type WorkoutStackParamList = {
  WorkoutList: undefined;
  WorkoutDetail: { workoutId: number };
  AddExercise: { workoutId: number };
};
```

**Leaf param lists** (`WorkoutStackParamList`, `AuthStackParamList`, etc.) — export from their navigator file.
**Composite param lists** (`AppTabParamList`, `RootStackParamList`) — define in `types.ts`, importing leaves via `NavigatorScreenParams<LeafParamList>`.

## Using Navigation in Components

Always use `useAppNavigation` from `src/navigation/hooks` — never receive `navigation` as a screen prop:
```tsx
import { useAppNavigation } from 'src/navigation/hooks';

export const WorkoutListScreen = () => {
  const navigation = useAppNavigation();
  navigation.navigate('App', { screen: 'WorkoutTab', params: { screen: 'WorkoutDetail', params: { workoutId: 1 } } });
  navigation.goBack();
};
```

## Using Route Params

Always use `useRoute` with an explicit `RouteProp` generic — never receive `route` as a screen prop:
```tsx
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

export const WorkoutDetailScreen = () => {
  const route = useRoute<RouteProp<WorkoutStackParamList, 'WorkoutDetail'>>();
  const { workoutId } = route.params;
};
```

## Rules
- Each feature stack is defined in its own file: `src/navigation/<Feature>Navigator.tsx`
- Named exports only — no `export default`
- Never use `navigation` or `route` screen props — always use `useAppNavigation` and `useRoute`
- Never call `useNavigation()` directly — use `useAppNavigation` from `src/navigation/hooks`
