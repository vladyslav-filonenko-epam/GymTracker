---
applyTo: "src/**/*.tsx, src/**/components/**"
---

# Component & Screen Instructions

> **Aesthetic:** Bold, athletic, performance-focused. Dark-mode first. Inspired by Strong and Hevy — clean, high contrast, metrics-prominent.

## Folder Structure
Every component and screen lives in its own PascalCase folder. Only create optional files when they are actually needed — never create empty files.

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
import { Pressable, Text } from 'react-native';

import { useStyles } from './styles';

interface WorkoutCardProps {
  title: string;
  date: string;
  onPress: () => void;
}

export const WorkoutCard = ({ title, date, onPress }: WorkoutCardProps) => {
  const { styles } = useStyles();

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>{date}</Text>
    </Pressable>
  );
};
```

If the component needs theme values for conditional logic (not styles), destructure from `useStyles`:
```tsx
const { styles, colors, isDark } = useStyles();
```

Only call `useTheme()` directly when you need `setTheme` or other non-style actions.

## Styles File (`styles.ts`)
```ts
import { createStyles } from 'src/shared/utils';

export const useStyles = createStyles(({ colors, spacing, radius, typography }) => ({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  title: {
    ...typography.bodyLarge,
  },
  date: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
}));
```

`createStyles` calls `StyleSheet.create` internally — no need to import `StyleSheet` in `styles.ts`.
Typography tokens already include `color: colors.text.primary` — override only when using a different color.

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
- Styles go in `styles.ts` using `createStyles` — no `StyleSheet.create` in `.tsx` files, no inline styles
- Import `useStyles` from `./styles` — never call `useTheme()` for styling
- Extract all business logic into hooks (`hooks.ts` or feature-level hooks)
- No commented-out code
- **Lists**: always use `FlashList` from `@shopify/flash-list` — never `FlatList`. Do NOT pass `estimatedItemSize` (v2 handles sizing automatically). Ensure the parent container has defined bounds (`flex: 1` or fixed height).

## Where to Place
| Type | Scope | Location |
|---|---|---|
| Component | 1 feature | `src/features/<name>/components/<ComponentName>/` |
| Component | 2+ features | `src/shared/components/<ComponentName>/` |
| Screen | any | `src/features/<name>/screens/<ScreenName>/` |

## Design System Rules
- NEVER hardcode colors, spacing, font sizes or weights — always use tokens
- Spread typography tokens: `{ ...typography.heading.xl }` — they include `color: colors.text.primary` by default; override only when needed: `{ ...typography.body.md, color: colors.text.secondary }`
- NEVER override `fontSize` or `fontWeight` after spreading a token — add a new token to `tokens.ts`
- `isDark` comes from `useStyles` — no need to call `useTheme()` for it
- Screen horizontal padding: `spacing.lg`
- Token values live in `src/shared/theme/tokens.ts` and `src/shared/theme/colors.ts`

## Component Guidelines
- **Buttons**: full-width on forms, 48px min height, `accent.primary` fill, `radius.lg`
- **Cards**: `background.card`, 1px `border`, `radius.lg`, padding `spacing.lg`
- **Inputs**: `surface` background, 48px height, `radius.md`
- **Bottom tabs**: `background.secondary`, active icon in `accent.primary`
- **FAB**: 56px, `accent.primary`, shadow, bottom-right

## Common Tokens
| Token | Usage |
|---|---|
| `colors.background.card` | Card background |
| `colors.background.primary` | Screen background |
| `colors.text.primary` | Main text |
| `colors.text.secondary` | Subtitles, metadata |
| `colors.accent.primary` | Buttons, highlights |
| `colors.border` | Borders, dividers |
| `spacing.lg` | Default padding |
| `radius.lg` | Card border radius |
| `radius.md` | Input border radius |
| `typography.heading.xl` | Screen titles |
| `typography.heading.md` | Card headers |
| `typography.body.md` | Default body text |
| `typography.caption` | Fine print, metadata |
| `typography.label` | Section headers, uppercase labels |
| `isDark` | Dark theme flag (from `useStyles`) |
