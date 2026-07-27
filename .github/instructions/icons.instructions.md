---
applyTo: "src/**"
---

# Icons Instructions

## Overview
Icons are SVG files in `src/shared/icons/`. They are exported as named React components from a single barrel `index.ts` and imported directly wherever needed — no wrapper component required.

## File Storage
```
src/shared/icons/
  index.ts          ← barrel export (required, always kept up to date)
  home.svg
  calendar.svg
  account.svg
  list-view.svg
  dumbbell.svg      ← add new icons here
```

**Naming rule:** kebab-case for SVG files — `arrow-right.svg`, `dumbbell.svg`, `chevron-down.svg`

## Barrel Export (`index.ts`)
Each SVG is re-exported as a PascalCase named component with an `Icon` suffix:
```ts
export { default as HomeIcon } from './home.svg';
export { default as CalendarIcon } from './calendar.svg';
export { default as AccountIcon } from './account.svg';
export { default as ListViewIcon } from './list-view.svg';
export { default as DumbbellIcon } from './dumbbell.svg';
```

## Usage
```tsx
import { HomeIcon, DumbbellIcon } from 'src/shared/icons';

const { colors } = useTheme();

<HomeIcon width={24} height={24} color={colors.accent.primary} />
<DumbbellIcon width={20} height={20} color={colors.text.secondary} />
```

## `color` Prop
Icons use `fill="currentColor"` internally. Pass `color` from `useTheme()` to tint them:
```tsx
<HomeIcon width={24} height={24} color={colors.accent.primary} />
```

Never pass a raw hex string — always use a theme color token.

## SVG Sizing Behavior
SVGs preserve aspect ratio by default (`preserveAspectRatio="xMidYMid meet"`):
- **Square viewBox** (e.g. `0 0 40 40`) + equal `width`/`height` → fills the box perfectly
- **Square viewBox** + unequal `width`/`height` → scales to the smaller dimension, centered in the box with empty space on the sides
- **Non-square viewBox** (e.g. `0 0 40 20`, 2:1 ratio) + equal `width`/`height` → the icon fills only half the height, centered vertically

For non-square icons, set `width` and `height` to match the icon's natural aspect ratio to avoid empty space.

## Adding a New Icon
1. Place the `.svg` file in `src/shared/icons/<name>.svg` — kebab-case filename
2. Add the export to `src/shared/icons/index.ts`:
   ```ts
   export { default as DumbbellIcon } from './dumbbell.svg';
   ```
That's it — no other files to update.

## Rules
- Color must always come from `useTheme()` — never pass a raw hex string to `fill`
- Always specify `width` and `height` explicitly — don't rely on SVG defaults
- Use the preferred sizes table — avoid arbitrary pixel values
- SVG file names are kebab-case, export names are PascalCase + `Icon` suffix
