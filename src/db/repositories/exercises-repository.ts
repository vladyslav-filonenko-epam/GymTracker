import { desc, eq } from 'drizzle-orm';

import { db } from '../index';
import { exercises } from '../schema';
import type { Exercise, NewExercise } from '../schema';

export const exercisesRepository = {
  findAll: (): Promise<Exercise[]> =>
    db.select().from(exercises).orderBy(desc(exercises.createdAt)),

  findById: (id: number): Promise<Exercise | undefined> =>
    db
      .select()
      .from(exercises)
      .where(eq(exercises.id, id))
      .then(r => r[0]),

  create: (data: NewExercise): Promise<Exercise> =>
    db
      .insert(exercises)
      .values(data)
      .returning()
      .then(r => r[0]),

  update: (id: number, data: Partial<NewExercise>): Promise<Exercise> =>
    db
      .update(exercises)
      .set({ ...data, updatedAt: Date.now() })
      .where(eq(exercises.id, id))
      .returning()
      .then(r => r[0]),

  delete: (id: number): Promise<void> =>
    db
      .delete(exercises)
      .where(eq(exercises.id, id))
      .then(() => undefined),
};
