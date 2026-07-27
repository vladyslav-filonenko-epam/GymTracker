import React, { useMemo } from 'react';

import { Animated, Pressable, Text, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { useSettingsStore } from 'src/features/settings/store';
import { useTheme } from 'src/shared/theme';

import { createStyles } from './styles';

export const SettingsScreen = () => {
  const { colors, spacing, radius, setTheme: setThemeContext } = useTheme();
  const { top } = useSafeAreaInsets();

  const { theme, setTheme } = useSettingsStore(
    useShallow(state => ({
      theme: state.theme,
      setTheme: state.setTheme,
    })),
  );

  const isDark = theme === 'dark';
  const styles = createStyles(colors, spacing, radius, isDark, top);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const thumbAnim = useMemo(() => new Animated.Value(isDark ? 0 : 20), []);

  const handleToggle = () => {
    const newTheme = isDark ? 'light' : 'dark';
    const toValue = newTheme === 'dark' ? 0 : 20;

    Animated.timing(thumbAnim, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setTheme(newTheme);
    setThemeContext(newTheme);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SETTINGS</Text>

      <Text style={styles.sectionHeader}>PREFERENCES</Text>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Dark Mode</Text>

        <Pressable testID="theme-toggle" onPress={handleToggle} style={styles.toggle}>
          <Animated.View style={[styles.toggleThumb, { transform: [{ translateX: thumbAnim }] }]} />
        </Pressable>
      </View>
    </View>
  );
};
