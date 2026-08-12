import { seedExercises } from './exercises-seed';

export const seedDatabase = async (): Promise<void> => {
  await seedExercises();
};
