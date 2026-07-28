import React from 'react';

import { Text, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from 'src/shared/theme';

import { createStyles } from './styles';

export const WorkoutListScreen = () => {
  const { colors, spacing, radius } = useTheme();
  const { top } = useSafeAreaInsets();
  const styles = createStyles(colors, spacing, radius, top);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>WORKOUTS</Text>

      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No workouts yet</Text>
      </View>
    </View>
  );
};
