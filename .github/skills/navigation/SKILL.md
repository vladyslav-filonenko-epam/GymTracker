---
name: navigation
description: 'React Navigation v7 patterns, APIs, and breaking changes vs v6. Use when creating navigators, typing navigation props, using navigation actions, or migrating v6 patterns.'
---

# React Navigation v7

Uses the **dynamic API** (JSX `<Stack.Screen>` children), not the static API.

---

## Project Structure

```
src/navigation/
  RootNavigator.tsx       ← NavigationContainer + auth gate
  AuthStackNavigator.tsx  ← unauthenticated stack
  AppTabsNavigator.tsx    ← bottom tab navigator
  WorkoutNavigator.tsx    ← workout nested stack
  ExercisesNavigator.tsx  ← exercises nested stack
  SettingsNavigator.tsx   ← settings nested stack
  hooks.ts                ← useAppNavigation, useAppRoute
  types.ts                ← RootStackParamList, AppTabParamList
```

**Param list rule:** leaf param lists (`WorkoutStackParamList`, etc.) live in their navigator file and are exported. Composite param lists (`AppTabParamList`, `RootStackParamList`) live in `types.ts` and use `NavigatorScreenParams<LeafParamList>`.

---

## TypeScript — Param Lists

**Rules:** all param lists must be fully typed — no `any`; use `undefined` for screens with no params, never omit it.

## Using Navigation in Components

Always use `useAppNavigation` from `src/navigation/hooks` — never receive `navigation` as a screen prop:
```tsx
import { useAppNavigation } from 'src/navigation/hooks';

export const WorkoutListScreen = () => {
  const navigation = useAppNavigation();
  navigation.navigate('App', { screen: 'WorkoutTab', params: { screen: 'WorkoutList' } });
  navigation.goBack();
};
```

Never call `useNavigation()` with a manual generic — `useAppNavigation` is the single typed entry point.

## Using Route Params

Always use `useRoute` with an explicit `RouteProp` generic — never receive `route` as a screen prop:
```tsx
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

export const WorkoutDetailScreen = () => {
  const route = useRoute<RouteProp<WorkoutStackParamList, 'WorkoutDetail'>>();
  const { workoutId } = route.params; // typed
};
```

`useRoute()` without a generic returns `object` params — always provide the `RouteProp` generic.

---

## Navigation Actions — v7 Breaking Changes

```ts
// ❌ v6 — navigate would pop back to existing screen
// ✅ v7 — navigate always pushes; use popTo to go back
navigation.popTo('Home');
navigation.navigate('Home', undefined, { pop: true }); // explicit pop

// ❌ v6 — navigate('NestedScreen') was fragile
// ✅ v7 — must specify parent
navigation.navigate('ParentTab', { screen: 'NestedScreen' });

// popTo — go back to existing screen (or push if not present)
navigation.popTo('PreviousScreen', { foo: 42 });

// navigate no longer accepts `key` option — use `getId` prop on <Stack.Screen> instead
```

---

## Native Stack — v7 Option Changes

| v6 | v7 |
|---|---|
| `customAnimationOnGesture` | `animationMatchesGesture` |
| `statusBarColor` | `statusBarBackgroundColor` (⚠️ deprecated Android SDK 35+) |
| `headerBackTitleVisible: false` | `headerBackButtonDisplayMode: 'minimal'` |
| `animationEnabled: false` | `animation: 'none'` |

**`headerBackButtonDisplayMode`** values: `'default'` · `'generic'` · `'minimal'`

**`formSheet` presentation** (native bottom sheet):
```ts
options={{
  presentation: 'formSheet',
  sheetAllowedDetents: [0.5, 1.0], // or 'fitToContents'
  sheetInitialDetentIndex: 0,
  sheetGrabberVisible: true,
  sheetCornerRadius: 16,
}}
```

```ts
screenOptions={{ freezeOnBlur: true }} // prevent inactive screen re-renders
```

---

## Bottom Tabs — v7 Option Changes

| v6 | v7 |
|---|---|
| `tabBarTestID` | `tabBarButtonTestID` |
| `sceneContainerStyle` prop | `screenOptions={{ sceneStyle: ... }}` |
| `unmountOnBlur` | `popToTopOnBlur` |

```ts
screenOptions={{
  tabBarPosition: 'bottom', // 'bottom' | 'top' | 'left' | 'right'
  tabBarVariant: 'uikit',   // 'uikit' | 'material'
  animation: 'fade',        // 'fade' | 'shift' | 'none'
  popToTopOnBlur: true,
  freezeOnBlur: true,
}}
```

```ts
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
```

---

## NavigationContainer — v7 Changes

```ts
// theme now requires fonts
import { DefaultTheme } from '@react-navigation/native';
const theme = { colors: { ... }, fonts: DefaultTheme.fonts };

// navigation state is frozen in dev — never mutate
const state = navigation.getState();
state.routes[0].params = { ... }; // ❌ throws
```
