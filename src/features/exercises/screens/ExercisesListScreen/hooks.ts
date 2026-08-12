import { useEffect } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { useExercisesStore } from 'src/features/exercises/store';

export const useExercisesListScreen = () => {
  const { exercises, isLoading, fetchExercises } = useExercisesStore(
    useShallow(s => ({
      exercises: s.exercises,
      isLoading: s.isLoading,
      fetchExercises: s.fetchExercises,
    })),
  );

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return { exercises, isLoading };
};
