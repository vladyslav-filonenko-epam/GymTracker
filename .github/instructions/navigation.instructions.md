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
Every navigator must have a fully typed param list. Define it in the same file as the navigator:
```ts
type WorkoutStackParamList = {
  WorkoutList: undefined;
  WorkoutDetail: { workoutId: number };
  AddExercise: { workoutId: number };
};
```

Root-level param lists:
```ts
type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppTabParamList>;
};

type AppTabParamList = {
  WorkoutTab: NavigatorScreenParams<WorkoutStackParamList>;
  ExercisesTab: NavigatorScreenParams<ExercisesStackParamList>;
  SettingsTab: NavigatorScreenParams<SettingsStackParamList>;
};
```

## Navigator Template
```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { WorkoutDetailScreen, WorkoutListScreen } from 'src/features/workout/screens';

type WorkoutStackParamList = {
  WorkoutList: undefined;
  WorkoutDetail: { workoutId: number };
};

const Stack = createNativeStackNavigator<WorkoutStackParamList>();

export const WorkoutNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WorkoutList" component={WorkoutListScreen} />
    <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
  </Stack.Navigator>
);
```

## Auth Gate
`RootNavigator` reads `is_authenticated` from MMKV storage to decide which stack to render:
```tsx
export const RootNavigator = () => {
  const isAuthenticated = storage.getBoolean('is_authenticated') ?? false;

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};
```

## Rules
- All param lists must be fully typed — no `any`, no missing params
- `undefined` for screens with no params — never omit the type
- Each feature stack is defined in its own file: `src/navigation/<Feature>Navigator.tsx`
- Named exports only — no `export default`
