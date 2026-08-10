---
name: imports-exports
description: 'Import/export conventions. Use when adding, moving, or reviewing imports and exports — especially barrel index.ts completeness and combining same-source imports.'
---

# Imports & Exports

## Barrel Rule
Only create `index.ts` when a folder is a **module or feature** that other code imports from as a unit.

**Do create `index.ts`:**
- Feature folders and their sub-folders (e.g. `features/auth/`, `features/auth/store/`)
- Shared sub-domains (e.g. `shared/utils/`, `shared/theme/`)
- Component folders (e.g. `components/Button/`)

**Do NOT create `index.ts`:**
- Container/grouping folders that are never imported directly (e.g. `shared/`, `navigation/`, `db/`)
- Flat collections where each file is imported by name

When a barrel exists, it must re-export everything consumed by other modules. If a symbol is missing, add it.

## When to Use the Barrel vs Direct Path
- **Cross-folder import** → always use the barrel
- **Within the same folder** → use relative path (`./helpers`, `../types`)
- **Exception — circular dependency** → if using the barrel would create a circular dependency (module A barrel → module B → module A barrel), import directly from the leaf file instead. This applies to both source files and their test files — the cycle is present at test runtime too and causes exports to resolve as `undefined`.

  **How to detect:** if file `a/foo.ts` imports from `b/index.ts`, and any file inside `b/` imports from `a/index.ts`, a cycle exists. Fix by importing the specific leaf file in `a/foo.ts` instead of the barrel.

```ts
// ✅ Cross-folder — use barrel
import { foo, bar } from 'src/shared/utils';
import { useFeatureStore } from 'src/features/auth';

// ✅ Same-folder — use relative
import type { StepType } from '../types';
import { formatValue } from './helpers';
```

## Combine Same-Source Imports
Multiple value imports from the same module must be merged into one statement. Type imports must be **separate** from value imports using `import type`:

```ts
// ❌ Split value imports
import { foo } from 'src/shared/utils';
import { bar } from 'src/shared/utils';

// ✅ Combined value imports
import { foo, bar } from 'src/shared/utils';

// ❌ Types mixed with values
import { foo, type FooProps } from 'src/shared/utils';

// ✅ Types in a separate import type statement
import { foo } from 'src/shared/utils';
import type { FooProps } from 'src/shared/utils';
```

## Type Exports in Index Files
`export type` statements must come **after** all value exports, separated by a blank line:

```ts
// ✅ Correct — value exports first, then types after a blank line
export { foo } from './foo';
export { bar } from './bar';

export type { FooProps, BarProps } from './foo';

// ❌ Wrong — types mixed in with value exports
export { foo } from './foo';
export type { FooProps } from './foo';
export { bar } from './bar';
```

- Re-exports only — no logic, no component JSX
- Always `.ts` extension, even when re-exporting `.tsx` files
- Export every symbol that is (or will be) imported from outside the folder

```ts
// ✅ Correct index.ts
export { Card } from './Card';
export type { CardProps } from './Card';

// ❌ Wrong — logic in index
export const helper = () => { ... };
```

**Exception — module entry point:** if `index.ts` IS the module itself (e.g. bootstrapping, side effects) rather than a barrel for other files, logic is allowed.

Rule of thumb: if `index.ts` exists alongside other `.ts` files it re-exports → barrel, no logic. If it's the sole logic file for the folder → module entry point, logic allowed.

## Checklist When Adding a New Export
1. Symbol defined in leaf file ✓
2. Symbol added to `index.ts` of its folder ✓
3. All consumers import from the barrel, not the leaf file ✓
4. No duplicate import statements for the same source ✓
