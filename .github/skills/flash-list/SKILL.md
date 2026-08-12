---
name: flash-list
description: 'FlashList v2 patterns for React Native. Use when implementing any scrollable list, migrating FlatList to FlashList, or when the user mentions FlashList, FlatList, list rendering, scrollable list, or list performance.'
---

# Skill: React Native FlashList v2 Implementation & Migration

## Purpose
Use this skill when implementing a list in a React Native application, migrating a `FlatList` to `FlashList`, or upgrading from FlashList v1 to v2. 

## Prerequisites
- Verify in `package.json` that `@shopify/flash-list` is at version `^2.0.0` or higher.
- Ensure the project is using React Native's New Architecture, as FlashList v2 requires it.

## Workflow
Follow these steps strictly when building or migrating a list:

1. **Import Component:** Use `import { FlashList } from "@shopify/flash-list";`.
2. **Consult Reference:** Read `flashlist_reference.md` for v2 syntax changes, deprecated props, ref typing, and masonry layout rules.
3. **Assign Core Props:** 
    - Map the `data`, `renderItem`, and `keyExtractor` props just like a standard `FlatList`.
    - **CRITICAL:** Do NOT use `estimatedItemSize`, `estimatedListSize`, or `estimatedFirstItemOffset`. FlashList v2 handles sizing automatically.
4. **Handle Masonry (If applicable):** If a masonry layout is needed, use the `<FlashList masonry numColumns={...} />` prop instead of the old `MasonryFlashList` component.
5. **Validation (Mandatory):**
    - Ensure the parent container of the `<FlashList />` has defined bounds (e.g., `flex: 1` or a fixed height). FlashList will not render if its parent has no bounds.
    - If using Refs, verify it is typed as `FlashListRef` and not `FlashList`.

## Anti-Pattern Warnings
- **Do not** attempt to estimate item sizes. 
- **Do not** use deprecated components like `MasonryFlashList` or `CellContainer`.