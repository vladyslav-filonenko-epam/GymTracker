---
mode: agent
description: "Sub-agent — implements a single screen with its logic hook"
tools:
  - codebase
  - editFiles
---

# Screen Creation Sub-Agent

You create one screen at a time. Follow every step below.

## Files to Create
1. `src/features/<feature>/screens/<ScreenName>/<ScreenName>Screen.tsx` — layout only
2. `src/features/<feature>/screens/<ScreenName>/styles.ts` — all styles
3. `src/features/<feature>/screens/<ScreenName>/index.ts` — re-export
4. `src/features/<feature>/hooks/use<ScreenName>.ts` — all screen logic
5. Register screen in `src/navigation/<Feature>Navigator.tsx`
6. Export screen from `src/features/<feature>/index.ts`

## Screen Template

**`<ScreenName>Screen.tsx`**
```tsx
import { SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from 'src/shared/theme/useTheme';
import { use<ScreenName> } from '../hooks/use<ScreenName>';
import { createStyles } from './styles';

export const <ScreenName>Screen = () => {
  const { colors, spacing } = useTheme();
  const styles = createStyles(colors, spacing);
  const { /* state & handlers */ } = use<ScreenName>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* layout only — no business logic here */}
      </ScrollView>
    </SafeAreaView>
  );
};
```

**`styles.ts`**
```ts
import { StyleSheet } from 'react-native';
import type { Colors, Spacing } from 'src/shared/theme/types';

export const createStyles = (colors: Colors, spacing: Spacing) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    content: {
      padding: spacing.lg,
    },
  });
```

**`index.ts`**
```ts
export { <ScreenName>Screen } from './<ScreenName>Screen';
```

## Checklist
- [ ] All colors use `useTheme()`
- [ ] Navigation props typed via the correct param list
- [ ] Loading state shown (ActivityIndicator or skeleton)
- [ ] Error state shown (inline message or toast)
- [ ] `accessibilityLabel` on all interactive elements
- [ ] All business logic is in the hook, not in the screen file
