import { useMemo } from 'react';

import { Text, View } from 'react-native';

import { DumbbellIcon } from 'src/shared/icons';

import { useStyles } from './styles';

interface ExerciseCardProps {
  name: string;
  muscles: string | null;
  equipment: string;
}

export const ExerciseCard = ({ name, muscles, equipment }: ExerciseCardProps) => {
  const { styles, colors } = useStyles();

  const musclesLabel = useMemo(() => {
    if (!muscles) return '';

    try {
      return (JSON.parse(muscles) as string[]).join(', ');
    } catch {
      return '';
    }
  }, [muscles]);

  return (
    <View style={styles.container}>
      <DumbbellIcon width={40} height={40} fill={colors.accent.primary} />

      <View style={styles.textBlock}>
        <Text style={styles.name}>{name}</Text>

        {musclesLabel ? <Text style={styles.muscles}>{musclesLabel}</Text> : null}

        <Text style={styles.caption}>{equipment}</Text>
      </View>
    </View>
  );
};
