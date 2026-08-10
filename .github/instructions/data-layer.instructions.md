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
// src/shared/utils/storage.ts — single instance + all keys, always import from here
import { storage, MMKV_KEYS } from 'src/shared/utils';
storage.getBoolean(MMKV_KEYS.IS_AUTHENTICATED);
```
Keys are defined as `MMKV_KEYS` in `storage.ts`. Never write key strings inline.

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
Keychain service identifiers:
- `com.gymtracker.pincode` — stores the hashed PIN (username: `'pin'`, password: hash)

**Rule:** never store the PIN hash in MMKV — always use Keychain.

## Database Schema (MVP)
```
exercises       — id, name, photoUri?, muscleGroup?, isCustom, createdAt, updatedAt
workouts        — id, name, startedAt, finishedAt?, notes?, createdAt, updatedAt
workout_exercises — id, workoutId→workouts, exerciseId→exercises, orderIndex, createdAt
sets            — id, workoutExerciseId→workout_exercises, reps, weight(real), isCompleted, createdAt
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
    db.update(exercises)
      .set({ ...data, updatedAt: Date.now() })
      .where(eq(exercises.id, id))
      .returning()
      .then(r => r[0]),
  delete: (id: number): Promise<void> =>
    db.delete(exercises).where(eq(exercises.id, id)).then(() => undefined),
};
```

## Repository File Naming
`src/db/repositories/<name>-repository.ts` — kebab-case with `-repository` suffix.

## Repository Rules
- Repositories return domain types, not raw Drizzle types
- Never import the Drizzle `db` instance outside of `src/db/`
- All async operations wrap errors as `AppError`

## Exercise Library Seed Data
Use **free-exercise-db** (https://github.com/yuhonas/free-exercise-db) — ~800 open-source exercises
with muscle groups, instructions, and categories. Seed on first launch in `src/db/seed.ts`.
Check `storage.getBoolean('exercises_seeded')` before seeding to avoid duplicates.
