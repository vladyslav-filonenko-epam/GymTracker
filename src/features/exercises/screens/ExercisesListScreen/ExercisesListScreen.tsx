import React from 'react';

import { Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStyles } from './styles';

export const ExercisesListScreen = () => {
  const { t } = useTranslation();
  const { top: topInset } = useSafeAreaInsets();

  const { styles } = useStyles({ topInset });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('exercises.title')}</Text>

      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('exercises.empty')}</Text>
      </View>
    </View>
  );
};
