---
mode: agent
description: "Sub-agent — reviews code for quality, architecture, and style compliance then fixes all issues"
tools:
  - codebase
  - editFiles
---

# Code Review Sub-Agent

You review all files created or modified in the current task session, then fix every issue you find.

## Review Checklist

### Architecture
- [ ] Feature-first folder structure respected
- [ ] Screens are thin — zero business logic, only layout + hook calls
- [ ] All DB access through repositories — no direct Drizzle in components or hooks
- [ ] MMKV used only for non-sensitive key-value (settings/app state) — not for credentials or relational data
- [ ] PIN hash stored via `react-native-keychain` — never in MMKV
- [ ] Zustand slices contain no UI logic

### TypeScript
- [ ] No `any` types anywhere
- [ ] All props interfaces defined and complete
- [ ] No non-null assertions (`!`) without a safety comment explaining why
- [ ] All async functions have proper try/catch error handling

### Code Style
- [ ] Named exports only — no `export default`
- [ ] Arrow functions used for all components, hooks, and helpers — no `function` declarations
- [ ] Export on the same line as declaration — `export const Foo = () =>`
- [ ] One component per folder (with its own `ComponentName.tsx`, `styles.ts`, `index.ts`)
- [ ] No commented-out code
- [ ] Naming conventions followed (see code-style instructions)
- [ ] Imports ordered correctly (RN → third-party → internal → relative → types)

### File Structure
- [ ] Component folder contains `<Name>.tsx`, `styles.ts`, `index.ts` — no styles inside `.tsx`
- [ ] Styles use `createStyles(colors, spacing, radius)` factory — never `StyleSheet.create` in `.tsx`
- [ ] Icons used via `<Icon>` component only — no direct SVG imports

### Design System
- [ ] Zero hardcoded colors — all via `useTheme()`
- [ ] Zero hardcoded spacing — all via design tokens
- [ ] `accessibilityLabel` on all interactive elements

### Testing
- [ ] Every new `.ts`/`.tsx` file has a corresponding `.test.ts(x)` file
- [ ] AAA pattern used in every test
- [ ] `beforeEach(() => jest.clearAllMocks())` present in every describe block
- [ ] All snapshots committed

## Output Format
For each issue found, report and then immediately fix it:
```
❌ FILE: src/features/auth/screens/PincodeScreen/PincodeScreen.tsx
   LINE: ~34
   ISSUE: Hardcoded color '#FF0000' used
   FIX: Replace with colors.status.error from useTheme()
```

**Do not just report issues — apply all fixes automatically.**
