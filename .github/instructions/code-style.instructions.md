---
applyTo: "src/**"
---

# Code Style Instructions

## TypeScript
- Strict mode is ON — no `any`, use `unknown` when type is truly unknown
- Prefer `interface` for object shapes, `type` for unions/aliases
- No `I` prefix on interfaces — `WorkoutItem` not `IWorkoutItem`
- Discriminated unions for async state:
  `{ status: 'idle' } | { status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: string }`

## Naming Conventions
| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `WorkoutCard` |
| Screens | PascalCase + Screen suffix | `WorkoutListScreen` |
| Hooks | camelCase + use prefix | `useWorkoutStore` |
| Utilities | camelCase | `formatWeight` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_SETS` |
| Files (components) | PascalCase | `WorkoutCard.tsx` |
| Files (non-components) | kebab-case | `format-weight.ts` |
| Files inside component folder | lowercase single-word | `styles.ts`, `hooks.ts`, `helpers.ts`, `constants.ts` |
| Icon files | kebab-case | `arrow-right.svg`, `dumbbell.svg` |
| Test files | `<name>.test.ts(x)` | `WorkoutCard.test.tsx`, `helpers.test.ts` |

## Import Order
Imports are **automatically sorted** by `@trivago/prettier-plugin-sort-imports` on format. Write imports in any order — Prettier will fix them. The enforced order is:
1. `react`
2. `react-native`
3. Third-party libraries
4. Internal absolute paths (`src/...`)
5. Relative paths (`./`, `../`)

Type-only imports (`import type`) are sorted within their respective group automatically.

## Component Structure
Each component lives in its own folder. Only create optional files when needed — do not create empty files.

**`WorkoutCard.tsx`** — JSX + props only:
```tsx
// 1. Imports
// 2. Props interface
// 3. Component — arrow function, export on the same line as declaration

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
}

export const WorkoutCard = ({ workout, onPress }: WorkoutCardProps) => {
  const { colors, spacing, radius } = useTheme();
  const styles = createStyles(colors, spacing, radius);
  // handlers...
  return ( ... );
};
```

**`styles.ts`** — all styles, theme-aware factory:
```ts
import { StyleSheet } from 'react-native';
import type { Colors, Spacing, Radius } from 'src/shared/theme/types';

export const createStyles = (colors: Colors, spacing: Spacing, radius: Radius) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background.card,
      borderRadius: radius.lg,
      padding: spacing.lg,
    },
  });
```

**`index.ts`** — re-export only (always `.ts` extension, never `.tsx`):
```ts
export { WorkoutCard } from './WorkoutCard';
```

## Rules
- Named exports only — no `export default`
- One component per folder
- **Arrow functions everywhere** — no `function` declarations for components, hooks, or helpers
- **Export on the same line as declaration** — `export const Foo = () => ...` not `const Foo = ...; export { Foo }`
- **All `index` files use `.ts` extension** — even when re-exporting `.tsx` components
- NO `StyleSheet.create` inside `.tsx` files — if styles are needed, always put them in `styles.ts`
- NO inline styles — when styles are needed, use `createStyles` in `styles.ts`
- Extract all logic from screens into hooks
- No commented-out code in commits
- **Every source file should have a corresponding test file** — exceptions only for pure config, barrel `index.ts` re-exports, and type-only files

## Prettier
Config: `printWidth: 100`, `singleQuote: true`, `jsxSingleQuote: false`, `trailingComma: 'all'`, `arrowParens: 'avoid'`, `bracketSameLine: false`, `endOfLine: 'lf'`
- Use **single quotes** for JS/TS strings — `'hello'`
- Use **double quotes** for JSX props — `<Component prop="value" />`
- Always add **trailing commas** in objects, arrays, and function params
- **No parens** on single-param arrow functions — `x => x` not `(x) => x`
- Closing `>` of multi-line JSX elements goes on its **own line**
- Line length target is **100 characters**
- Don't fight the formatter — write formatter-friendly code from the start
