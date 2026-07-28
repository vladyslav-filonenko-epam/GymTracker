import React from 'react';

import { Pressable, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from 'src/shared/theme';

import { useStyles } from './styles';

export const SettingsScreen = () => {
  const { t } = useTranslation();
  const { setTheme } = useTheme();
  const { top: topInset } = useSafeAreaInsets();

  const { styles, isDark } = useStyles({ topInset });

  const thumbOffset = useSharedValue(isDark ? 0 : 20);

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbOffset.value }],
  }));

  const handleToggle = () => {
    const newTheme = isDark ? 'light' : 'dark';

    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared values must be mutated via `.value`.
    thumbOffset.value = withTiming(newTheme === 'dark' ? 0 : 20, { duration: 200 });
    setTheme(newTheme);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings.title')}</Text>

      <Text style={styles.sectionHeader}>{t('settings.preferences')}</Text>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>{t('settings.darkMode')}</Text>

        <Pressable testID="theme-toggle" onPress={handleToggle} style={styles.toggle}>
          <Animated.View style={[styles.toggleThumb, thumbAnimatedStyle]} />
        </Pressable>
      </View>
    </View>
  );
};
