---
applyTo: "src/**/helpers.ts, src/**/utils/**"
---

# Helpers Instructions

## What Is a Helper
A helper is a **pure function** — no side effects, no state, no hooks, no API calls. Given the same input it always returns the same output. Helpers handle formatting, calculation, transformation, and validation logic.

## Where to Place Helpers
| Scope | Location |
|---|---|
| Used by 1 component only | `src/features/<name>/components/<Component>/helpers.ts` |
| Used by 2+ components in the same feature | `src/features/<name>/utils/<helper-name>.ts` |
| Used by 2+ features | `src/shared/utils/<helper-name>.ts` |

Promote up only when a **second consumer** appears — start local, move when needed.

## File Naming
- Inside a component folder: `helpers.ts` (lowercase single-word)
- In feature/shared utils: `kebab-case.ts` — e.g. `format-weight.ts`, `format-duration.ts`

## Helper File Template
```ts
// src/shared/utils/format-weight.ts

export const formatWeight = (kg: number): string => `${kg} kg`;

export const formatReps = (reps: number): string =>
  reps === 1 ? '1 rep' : `${reps} reps`;

export const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  return `${minutes}m ${seconds}s`;
};
```

## Rules
- Arrow functions only — no `function` declarations
- Named exports only — no `export default`
- Export on the same line as declaration
- Pure functions only — no side effects, no imports from hooks or stores
- No `any` — strict TypeScript types on all params and return values
- Each helper should do **one thing**

## What Belongs in Helpers (vs Hooks)
| Logic type | Goes in |
|---|---|
| Format a value for display | `helpers.ts` |
| Calculate from inputs | `helpers.ts` |
| Transform data shape | `helpers.ts` |
| Validate input | `helpers.ts` |
| Read/write state | `hooks.ts` |
| Call a repository | `hooks.ts` |
| Side effects | `hooks.ts` |
