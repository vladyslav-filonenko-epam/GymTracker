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
background: { primary: '#0D0D0D', secondary: '#1A1A1A', card: '#222222' }
surface: '#2C2C2C'
accent: { primary: '#FF6B35', secondary: '#FF8C42' }
text: { primary: '#FFFFFF', secondary: '#A0A0A0', muted: '#606060' }
border: '#333333'
status: { success: '#4CAF50', error: '#F44336', warning: '#FF9800' }
```
### Light Theme
```ts
background: { primary: '#F5F5F5', secondary: '#FFFFFF', card: '#FFFFFF' }
surface: '#EFEFEF'
accent: { primary: '#FF6B35', secondary: '#FF8C42' }
text: { primary: '#0D0D0D', secondary: '#555555', muted: '#999999' }
border: '#E0E0E0'
status: { success: '#4CAF50', error: '#F44336', warning: '#FF9800' }
```

## Typography Scale
| Token | Size | Weight | Usage |
|---|---|---|---|
| `heading.xl` | 32 | 700 | Screen titles |
| `heading.lg` | 28 | 700 | Section headers |
| `heading.md` | 24 | 600 | Card headers |
| `heading.sm` | 20 | 600 | Sub-sections |
| `body.lg` | 18 | 400 | Primary body text |
| `body.md` | 16 | 400 | Default body |
| `body.sm` | 14 | 400 | Secondary text |
| `caption` | 12 | 400 | Labels, metadata |

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
- NEVER hardcode colors — always `const { colors, spacing, radius } = useTheme()`
- NEVER hardcode spacing — use spacing tokens
- Screen horizontal padding: `spacing.lg` (16)

## Design Tokens Reference
```tsx
const { colors, spacing, radius } = useTheme();
```

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

## Icons
All icons are SVG files in `src/shared/icons/`. They are exported as named components from the barrel `index.ts` and imported directly.

```tsx
import { HomeIcon, DumbbellIcon } from 'src/shared/icons';

const { colors } = useTheme();

<HomeIcon width={24} height={24} color={colors.accent.primary} />
```

### Adding a new icon
1. Place the `.svg` file in `src/shared/icons/<name>.svg` — kebab-case filename (e.g. `dumbbell.svg`)
2. Add the export to `src/shared/icons/index.ts`:
   ```ts
   export { default as DumbbellIcon } from './dumbbell.svg';
   ```

### Rules
- Never import SVG files directly from their path — always import from `src/shared/icons`
- Color must come from `useTheme()` — never pass a raw hex string to `fill`
- Always specify `width` and `height` explicitly

