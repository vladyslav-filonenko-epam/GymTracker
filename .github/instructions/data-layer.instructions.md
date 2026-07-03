---
applyTo: "src/db/**, src/features/**"
---

# Data Layer Instructions

## Technologies
- **react-native-mmkv** — synchronous key-value (non-sensitive settings and app state)
- **react-native-keychain** — OS secure enclave storage (iOS Keychain / Android Keystore) for sensitive credentials
- **@op-engineering/op-sqlite** — SQLite engine for React Native
- **drizzle-orm** — Type-safe ORM with schema-first approach
- **drizzle-kit** — Migration generator (`npx drizzle-kit generate`)

## MMKV — non-sensitive key-value storage
```ts
// src/shared/utils/storage.ts — single instance, always import from here
import { MMKV } from 'react-native-mmkv';
export const storage = new MMKV({ id: 'gymtracker' });
```
MMKV keys:
- `biometrics_enabled` (boolean)
- `theme` ('dark' | 'light' | 'system')
- `is_authenticated` (boolean) — session flag
- `exercises_seeded` (boolean) — whether the exercise library has been seeded

## Keychain — sensitive credential storage
```ts
// src/shared/utils/keychain.ts — always import from here
import * as Keychain from 'react-native-keychain';

const PINCODE_SERVICE = 'com.gymtracker.pincode';

export const keychainUtils = {
  savePinHash: (hash: string) =>
    Keychain.setGenericPassword('pin', hash, { service: PINCODE_SERVICE }),
  getPinHash: async (): Promise<string | null> => {
    const result = await Keychain.getGenericPassword({ service: PINCODE_SERVICE });
    return result ? result.password : null;
  },
  deletePinHash: () => Keychain.resetGenericPassword({ service: PINCODE_SERVICE }),
};
```
Keychain keys:
- `pincode_hash` — hashed PIN, stored via `service: 'com.gymtracker.pincode'`

**Rule:** never store the PIN hash in MMKV — always use Keychain.

## Database Schema (MVP)
```
exercises       — id, name, photoUri?, muscleGroup?, isCustom, createdAt, updatedAt
workouts        — id, name, startedAt, finishedAt?, notes?, createdAt, updatedAt
workout_exercises — id, workoutId→workouts, exerciseId→exercises, orderIndex, createdAt
sets            — id, workoutExerciseId→workout_exercises, reps, weight(real), isCompleted, createdAt
```

## Drizzle Schema Template
```ts
import { integer, real, sqliteTable, text } from 'drizzle-orm/op-sqlite';

export const exercises = sqliteTable('exercises', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  photoUri: text('photo_uri'),
  muscleGroup: text('muscle_group'),
  isCustom: integer('is_custom', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'number' }).notNull().$defaultFn(() => Date.now()),
  updatedAt: integer('updated_at', { mode: 'number' }).notNull().$defaultFn(() => Date.now()),
});

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
```

## Repository Template
```ts
import { eq, desc } from 'drizzle-orm';
import { db } from '../db';
import { exercises, type Exercise, type NewExercise } from '../schema';

export const exercisesRepository = {
  findAll: (): Promise<Exercise[]> =>
    db.select().from(exercises).orderBy(desc(exercises.createdAt)),
  findById: (id: number): Promise<Exercise | undefined> =>
    db.select().from(exercises).where(eq(exercises.id, id)).then(r => r[0]),
  create: (data: NewExercise): Promise<Exercise> =>
    db.insert(exercises).values(data).returning().then(r => r[0]),
  update: (id: number, data: Partial<NewExercise>): Promise<Exercise> =>
    db.update(exercises).set({ ...data, updatedAt: Date.now() }).where(eq(exercises.id, id)).returning().then(r => r[0]),
  delete: (id: number): Promise<void> =>
    db.delete(exercises).where(eq(exercises.id, id)).then(() => undefined),
};
```
File naming: `src/db/repositories/exercises-repository.ts` (kebab-case, `-repository` suffix)

## Exercise Library Seed Data
Use **free-exercise-db** (https://github.com/yuhonas/free-exercise-db) — ~800 open-source exercises
with muscle groups, instructions, and categories. Seed on first launch in `src/db/seed.ts`.
Check `storage.getBoolean('exercises_seeded')` before seeding to avoid duplicates.
