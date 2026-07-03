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
- NEVER hardcode colors — always `const { colors, spacing } = useTheme()`
- NEVER hardcode spacing — use spacing tokens
- Screen horizontal padding: `spacing.lg` (16)
- Icons: always use the `Icon` wrapper component — never import SVGs directly

## Icons
All icons are SVG files in `src/icons/`. They are used exclusively through the shared `Icon` component.

### Icon component location
```
src/shared/components/Icon/
  Icon.tsx          ← wrapper component
  styles.ts         ← styles (if any)
  index.ts          ← re-export
  __tests__/
    Icon.test.tsx
```

### Usage
```tsx
import { Icon } from 'src/shared/components/Icon';

<Icon name="home" size={24} color={colors.accent.primary} />
<Icon name="calendar" size={20} color={colors.text.secondary} />
```

### Icon component contract
```tsx
import type { SvgProps } from 'react-native-svg';

type IconName = 'home' | 'calendar' | 'account' | 'list-view'; // extend as icons are added

interface IconProps extends Pick<SvgProps, 'width' | 'height'> {
  name: IconName;
  size?: number;       // sets both width and height; default: 24
  color?: string;      // passed as fill to the SVG; default: colors.text.primary
}
```

### Adding a new icon
1. Place the `.svg` file in `src/shared/icons/<name>.svg` — filename must be kebab-case (e.g. `dumbbell.svg`, `arrow-right.svg`)
2. Add `'<name>'` to the `IconName` union type in `Icon.tsx`
3. Add the import and mapping entry inside the icon map

### Rules
- Never import SVG files directly in screens or components — always go through `<Icon>`
- Never hardcode size numbers inline — prefer named sizes if needed (`sm=16, md=24, lg=32`)
- Color must come from `useTheme()` — never pass a raw hex string

