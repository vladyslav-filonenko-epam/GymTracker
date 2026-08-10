---
applyTo: "src/**"
---

# Code Style Instructions

## Naming Conventions
| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `WorkoutCard` |
| Screens | PascalCase + Screen suffix | `WorkoutListScreen` |
| Hooks | camelCase + `use` prefix | `useWorkoutStore` |
| Utilities | camelCase | `formatWeight` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_SETS` |
| Files (components/screens) | PascalCase | `WorkoutCard.tsx` |
| Files (non-components) | kebab-case | `format-weight.ts` |
| Files inside component folder | lowercase single-word | `styles.ts`, `hooks.ts` |
| Icon files | kebab-case | `arrow-right.svg` |
| Test files | `<name>.test.ts(x)` | `WorkoutCard.test.tsx` |

## React Import
- **Never** `import React from 'react'` — the new JSX transform handles JSX automatically
- Only import specific named APIs: `import { useState, useCallback } from 'react'`
- For types: `import type { ReactNode } from 'react'`

## Import Order
Automatically sorted by `@trivago/prettier-plugin-sort-imports` on format:
1. `react`
2. `react-native`
3. Third-party libraries
4. Internal absolute paths (`src/...`)
5. Relative paths (`./`, `../`)

## Prettier
`printWidth: 100`, `singleQuote: true`, `jsxSingleQuote: false`, `trailingComma: 'all'`, `arrowParens: 'avoid'`
- Single quotes for JS/TS strings, double quotes for JSX props
- No parens on single-param arrow functions — `x => x` not `(x) => x`
- Trailing commas in objects, arrays, function params
- Closing `>` of multi-line JSX on its own line
- Don't fight the formatter — write formatter-friendly code
