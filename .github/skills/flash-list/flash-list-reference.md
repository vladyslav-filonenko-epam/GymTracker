# FlashList v2 Reference & Gotchas

FlashList v2 automatically handles item sizing and relies on React Native's new architecture. Do not apply v1 patterns to a v2 implementation.

## 1. No Size Estimates Needed
Unlike v1, you must **remove** `estimatedItemSize`, `estimatedListSize`, and `estimatedFirstItemOffset`. 

```tsx
// ✅ Correct v2 Implementation
<FlashList 
  data={data} 
  renderItem={({ item }) => <MyItem item={item} />}
  keyExtractor={(item) => item.id.toString()}
  // Notice: No estimatedItemSize!
/>
```

## 2. Parent Container Bounds
FlashList uses absolute positioning under the hood. The `<FlashList/>` component **must** be wrapped in a container that has a defined size, typically `flex: 1`. 

```tsx
// ❌ BAD: FlashList will collapse to 0 height
const ListScreen = () => (
  <View>
    <FlashList data={data} renderItem={renderItem} />
  </View>
);

// ✅ GOOD: Parent has flex: 1
const ListScreen = () => (
  <View style={{ flex: 1 }}>
    <FlashList data={data} renderItem={renderItem} />
  </View>
);
```

## 3. Masonry Layout
`MasonryFlashList` is deprecated. Use the standard `FlashList` with the `masonry` prop. Note that `getColumnFlex` is no longer supported.

```tsx
// ✅ Correct v2 Masonry
import { FlashList } from "@shopify/flash-list";

<FlashList data={data} masonry numColumns={3} renderItem={renderItem} />
```

## 4. Ref Typing Updates
When using a ref, the type is now `FlashListRef`, not `FlashList`.

```tsx
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { useRef } from "react";

// ✅ Correct v2 Ref
const listRef = useRef<FlashListRef<ItemType>>(null);
```

## 5. AnimatedFlashList

`AnimatedFlashList` is exported directly from `@shopify/flash-list` — no need to manually wrap with `Animated.createAnimatedComponent`. It uses React Native's `Animated` (not Reanimated). Use it when you need to drive the list's own scroll or container via `Animated.Value`.

```tsx
import { AnimatedFlashList } from "@shopify/flash-list";

// Scroll + animated container — uses RN Animated, not Reanimated
<AnimatedFlashList data={data} renderItem={renderItem} />;
```

For Reanimated-driven per-item animations, apply `entering`/`exiting` props directly to each item's `Animated.View` inside `renderItem` instead.

## 5. Advanced Layout & Components
- **`overrideItemLayout`**: In v2, this prop *only* supports modifying the `span` (e.g., `layout.span = item.span`). Modifying `layout.size` is deprecated.
- **`CellContainer`**: This is no longer exported in v2. If you are forwarding a custom `CellRendererComponent`, use a standard React Native `View` instead.
- **Removed Props**: Do not use `onBlankArea`, `disableHorizontalListHeightMeasurement`, or `disableAutoLayout`.