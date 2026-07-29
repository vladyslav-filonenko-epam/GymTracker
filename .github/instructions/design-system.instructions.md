---
applyTo: "src/**/*.tsx"
---

# Design System Instructions

## Aesthetic
Bold, athletic, performance-focused. **Dark-mode first.**
Inspired by fitness apps like Strong and Hevy — clean, high contrast, metrics-prominent.

## Color Tokens
### Dark Theme
```ts
background: { primary: '#0C0C0E', secondary: '#1E1E22', card: '#161618' }
surface: '#2A2A2F'
accent: { primary: '#C8FF00', secondary: '#A8D900' }
text: { primary: '#F0F0F2', secondary: '#888896', muted: '#555560' }
border: 'rgba(255,255,255,0.08)'
status: { success: '#4CAF50', error: '#FF3B5C', warning: '#FF9800' }
```
### Light Theme
```ts
background: { primary: '#F5F5F5', secondary: '#FFFFFF', card: '#FFFFFF' }
surface: '#EFEFEF'
accent: { primary: '#C8FF00', secondary: '#A8D900' }
text: { primary: '#0D0D0D', secondary: '#555555', muted: '#999999' }
border: '#E0E0E0'
status: { success: '#4CAF50', error: '#FF3B5C', warning: '#FF9800' }
```

## Typography Scale
All typography tokens live in `src/shared/theme/tokens.ts`. **Never override `fontSize` or `fontWeight` in `styles.ts` — if a new size/weight combination is needed, add a new token.**

| Token | Size | Weight | Usage |
|---|---|---|---|
| `heading.xl` | 32 | 700 | Screen titles |
| `heading.lg` | 28 | 700 | Section headers |
| `heading.md` | 24 | 600 | Card headers |
| `heading.sm` | 20 | 600 | Sub-sections |
| `body.lg` | 18 | 400 | Primary body text |
| `body.md` | 16 | 400 | Default body |
| `body.sm` | 14 | 400 | Secondary text |
| `caption` | 12 | 400 | Fine print, metadata |
| `label` | 12 | 600 | Section headers, uppercase UI labels |
| `display.sm` | 20 | 700 | Brand/logo text |
| `display.md` | 24 | 500 | Large interactive keys (numpad) |

## Spacing Scale (multiples of 4)
`xs=4, sm=8, md=12, lg=16, xl=20, xxl=24, xxxl=32, huge=48, giant=64`

## Border Radius
`sm=4, md=8, lg=12, xl=16, full=9999`

## Component Guidelines
- **Buttons**: full-width on forms, 48px height min, accent.primary fill, border-radius `lg`
- **Cards**: `background.card`, 1px `border`, border-radius `lg`, padding `lg`
- **Inputs**: `surface` background, 48px height, border-radius `md`
- **Bottom tabs**: `background.secondary`, active icon in `accent.primary`
- **FAB**: 56px, `accent.primary`, shadow, positioned bottom-right

## Usage Rules
- NEVER hardcode colors — `colors` is available from `useStyles` or `useTheme()` for non-style uses (e.g. icon props)
- NEVER hardcode spacing — use spacing tokens
- NEVER hardcode font sizes or weights — spread the relevant `typography` token: `{ ...typography.heading.xl }`
- Typography tokens already include `color: colors.text.primary` by default — no need to add it manually. Override only when a different color is intentionally needed: `{ ...typography.body.md, color: colors.text.secondary }`
- NEVER override `fontSize` or `fontWeight` after spreading a token — add a new token to `tokens.ts` instead
- `isDark` is available directly from `useStyles` — no need to call `useTheme()` to compute it
- Screen horizontal padding: `spacing.lg` (16)

## Styles Pattern

Every component or screen gets styles from a `styles.ts` file using `createStyles`:

```ts
// styles.ts
import { createStyles } from 'src/shared/utils';

export const useStyles = createStyles(({ colors, spacing, radius, typography }) => ({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  title: {
    ...typography.heading.xl,
    // color: colors.text.primary is included automatically — override only when needed
  },
}));
```

```tsx
// Component.tsx
import { useStyles } from './styles';

export const WorkoutCard = ({ workout }: WorkoutCardProps) => {
  const { styles, colors, isDark } = useStyles();
  // Use `colors` for non-style props (e.g. SVG icon colors)
  // Use `isDark` for conditional logic — no need to call useTheme() for this
  return <View style={styles.container} />;
};
```

When extra props are needed in the factory:
```ts
// styles.ts
export const useStyles = createStyles(({ colors, spacing }, { topInset }: { topInset: number }) => ({
  container: { paddingTop: topInset + spacing.lg },
}));
```
```tsx
// Component.tsx
const { styles } = useStyles({ topInset });
```

## Design Tokens Reference

| Token | Usage |
|---|---|
| `colors.background.card` | Card background |
| `colors.background.primary` | Screen background |
| `colors.text.primary` | Main text |
| `colors.text.secondary` | Subtitles, metadata |
| `colors.accent.primary` | Buttons, highlights |
| `colors.border` | Borders, dividers |
| `spacing.lg` (16) | Default padding |
| `radius.lg` (12) | Card border radius |
| `radius.md` (8) | Input border radius |
| `typography.heading.xl` | Screen titles (32/700) |
| `typography.heading.md` | Card headers (24/600) |
| `typography.body.md` | Default body text (16/400) |
| `typography.caption` | Fine print (12/400) |
| `typography.label` | Section headers, uppercase labels (12/600) |
| `typography.display.sm` | Brand/logo text (20/700) |
| `typography.display.md` | Numpad / large interactive keys (24/500) |
| `isDark` | From `useStyles` — whether dark theme is active |

## Icons

All icons are SVG files in `src/shared/icons/`. They are exported as named components from the barrel `index.ts`.

```tsx
import { DumbbellIcon } from 'src/shared/icons';

export const MyComponent = () => {
  const { colors } = useStyles(stylesFactory); // colors available from useStyles
  return <DumbbellIcon width={24} height={24} color={colors.accent.primary} />;
};
```

### Adding a new icon
1. Place the `.svg` file in `src/shared/icons/<name>.svg` — kebab-case filename
2. Add the export to `src/shared/icons/index.ts`:
   ```ts
   export { default as DumbbellIcon } from './dumbbell.svg';
   ```

### Rules
- Never import SVG files directly from their path — always import from `src/shared/icons`
- Color must come from `useStyles` result — never pass a raw hex string
- Always specify `width` and `height` explicitly
