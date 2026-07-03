---
mode: agent
description: "Sub-agent — implements a single reusable UI component"
tools:
  - codebase
  - editFiles
---

# Component Creation Sub-Agent

You create one component at a time.

## Files to Create
1. `src/features/<feature>/components/<ComponentName>/<ComponentName>.tsx` — JSX + props
2. `src/features/<feature>/components/<ComponentName>/styles.ts` — all styles
3. `src/features/<feature>/components/<ComponentName>/index.ts` — re-export
4. Export from `src/features/<feature>/index.ts`

## Component Template

**`<ComponentName>.tsx`**
```tsx
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'src/shared/theme/useTheme';
import { createStyles } from './styles';

interface <ComponentName>Props {
  // define all props with types
  onPress?: () => void;
}

export const <ComponentName> = ({ onPress }: <ComponentName>Props) => {
  const { colors, spacing, radius } = useTheme();
  const styles = createStyles(colors, spacing, radius);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="<describe action>"
    >
      {/* component content */}
    </TouchableOpacity>
  );
};
```

**`styles.ts`**
```ts
import { StyleSheet } from 'react-native';
import type { Colors, Spacing, Radius } from 'src/shared/theme/types';

export const createStyles = (colors: Colors, spacing: Spacing, radius: Radius) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background.card,
      borderRadius: radius.lg,
      padding: spacing.lg,
    },
  });
```

**`index.ts`**
```ts
export { <ComponentName> } from './<ComponentName>';
```

## Checklist
- [ ] Props interface fully typed above the component
- [ ] `useTheme()` for all colors, spacing, and border radii
- [ ] Zero hardcoded colors or magic number spacing
- [ ] `accessibilityLabel` and `accessibilityRole` on interactive elements
- [ ] Named export on the same line as the arrow function declaration
- [ ] `index.ts` (`.ts` extension, not `.tsx`)
