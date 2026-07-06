---
applyTo: "src/**/*.tsx, src/**/components/**"
---

# Component Instructions

## Folder Structure
Every component lives in its own PascalCase folder. Only create optional files when they are actually needed — never create empty files.

```
WorkoutCard/
  WorkoutCard.tsx     ← JSX + props (required)
  styles.ts           ← styles factory (optional — only if the component has styles)
  constants.ts        ← component-scoped constants (optional)
  helpers.ts          ← component-scoped pure helpers (optional)
  hooks.ts            ← component-scoped hooks (optional)
  index.ts            ← re-export (required, always .ts not .tsx)
  __tests__/
    WorkoutCard.test.tsx
    helpers.test.ts   ← only if helpers.ts exists
    hooks.test.ts     ← only if hooks.ts exists
```

## File Naming Inside a Component Folder
| File | Convention | Example |
|---|---|---|
| Component file | PascalCase | `WorkoutCard.tsx` |
| Styles | lowercase single-word | `styles.ts` |
| Helpers | lowercase single-word | `helpers.ts` |
| Hooks | lowercase single-word | `hooks.ts` |
| Constants | lowercase single-word | `constants.ts` |
| Barrel export | lowercase | `index.ts` |

## Component File Structure (`WorkoutCard.tsx`)
```tsx
// 1. Imports
import { Pressable, Text, View } from 'react-native';

import { useTheme } from 'src/shared/theme';

import { createStyles } from './styles';

// 2. Props interface
interface WorkoutCardProps {
  title: string;
  date: string;
  onPress: () => void;
}

// 3. Component — arrow function, export on same line as declaration
export const WorkoutCard = ({ title, date, onPress }: WorkoutCardProps) => {
  const { colors, spacing, radius } = useTheme();
  const styles = createStyles(colors, spacing, radius);

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>{date}</Text>
    </Pressable>
  );
};
```

## Styles File (`styles.ts`)
```ts
import { StyleSheet } from 'react-native';

import type { Colors, Radius, Spacing } from 'src/shared/theme/types';

export const createStyles = (colors: Colors, spacing: Spacing, radius: Radius) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background.card,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
    },
    title: {
      color: colors.text.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    date: {
      color: colors.text.secondary,
      fontSize: 14,
    },
  });
```

## Index File (`index.ts`)
```ts
export { WorkoutCard } from './WorkoutCard';
```

## Rules
- Named exports only — no `export default`
- One component per folder
- Arrow functions everywhere — no `function` declarations
- Export on the same line as declaration
- `index.ts` extension always `.ts` — never `.tsx`
- NO `StyleSheet.create` inside `.tsx` files — if the component needs styles, put them in `styles.ts`
- NO inline styles — if you need styles, create `styles.ts`
- Extract all business logic into hooks (`hooks.ts` or feature-level hooks)
- No commented-out code

## Using Navigation
`useNavigation` and `useRoute` are hooks — call them only inside components or custom hooks, never in plain files.

```tsx
import { useNavigation } from '@react-navigation/native';

export const WorkoutListScreen = () => {
  // No generic needed for common actions
  const navigation = useNavigation();

  navigation.navigate('WorkoutDetail', { workoutId: 1 });
  navigation.goBack();
  navigation.replace('WorkoutList');
};
```

For navigator-specific APIs (`push`, `pop` etc.), annotate manually — but the docs warn this is **not type-safe**:
```tsx
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProps = NativeStackNavigationProp<WorkoutStackParamList>;

export const WorkoutListScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  navigation.push('WorkoutDetail', { workoutId: 1 });
};
```

Never use `navigation.navigate` with untyped strings — always reference screen names from the typed param list.

## Using Route Params
`useRoute` needs a generic to get typed params:
```tsx
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

type RouteProps = RouteProp<WorkoutStackParamList, 'WorkoutDetail'>;

export const WorkoutDetailScreen = () => {
  const route = useRoute<RouteProps>();
  const { workoutId } = route.params; // typed
};
```

## Where to Place Components
| Scope | Location |
|---|---|
| Used by 1 feature only | `src/features/<name>/components/<ComponentName>/` |
| Used by 2+ features | `src/shared/components/<ComponentName>/` |
