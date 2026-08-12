import { create } from 'zustand';

import { exercisesRepository } from 'src/db/repositories';
import type { Exercise } from 'src/db/schema';

interface ExercisesState {
  exercises: Exercise[];
  isLoading: boolean;
  error: string | null;
  fetchExercises: () => Promise<void>;
}

export const useExercisesStore = create<ExercisesState>(set => ({
  exercises: [],
  isLoading: false,
  error: null,
  fetchExercises: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await exercisesRepository.findAll();

      set({ exercises: data, isLoading: false });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : 'Unknown error', isLoading: false });
    }
  },
}));
