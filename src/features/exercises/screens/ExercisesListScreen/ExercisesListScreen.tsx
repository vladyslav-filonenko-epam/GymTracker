import { ActivityIndicator, Text, View } from 'react-native';

import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Exercise } from 'src/db/schema';
import { ExerciseCard } from 'src/features/exercises/components';

import { useExercisesListScreen } from './hooks';
import { useStyles } from './styles';

export const ExercisesListScreen = () => {
  const { t } = useTranslation();
  const { top: topInset } = useSafeAreaInsets();
  const { styles, colors } = useStyles({ topInset });
  const { exercises, isLoading } = useExercisesListScreen();

  const renderItem = ({ item }: { item: Exercise }) => (
    <ExerciseCard name={item.name} muscles={item.muscles} equipment={item.equipment} />
  );

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator color={colors.accent.primary} style={styles.loader} />;
    }

    if (exercises.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('exercises.empty')}</Text>
        </View>
      );
    }

    return (
      <FlashList
        data={exercises}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('exercises.title')}</Text>

      {renderContent()}
    </View>
  );
};
