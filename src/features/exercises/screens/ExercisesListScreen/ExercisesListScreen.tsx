import React from 'react';

import { Text, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from 'src/shared/theme';

import { createStyles } from './styles';

export const ExercisesListScreen = () => {
  const { colors, spacing, radius } = useTheme();
  const { top } = useSafeAreaInsets();
  const styles = createStyles(colors, spacing, radius, top);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>EXERCISES</Text>

      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No exercises yet</Text>
      </View>
    </View>
  );
};
