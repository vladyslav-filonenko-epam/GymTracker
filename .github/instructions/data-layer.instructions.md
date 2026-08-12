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

## DB Instance

Single export point — always import `db` from `src/db`:

```ts
// src/db/index.ts
import { open } from '@op-engineering/op-sqlite';
import { drizzle } from 'drizzle-orm/op-sqlite';
import * as schema from './schema';

const client = open({ name: 'gymtracker.db' });

export const db = drizzle(client, { schema });
export { migrations } from './migrations/migrations';
export { seedDatabase } from './seeds';
```

Never import `db` outside of `src/db/`.

## Database Schema (MVP)
```
exercises — id, name, sport, equipment, muscles?(JSON text), description?, createdAt, updatedAt
```

Column types always import from `'drizzle-orm/sqlite-core'` — never from `'drizzle-orm/op-sqlite'`.

```ts
// src/db/schema/exercises.ts
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const exercises = sqliteTable('exercises', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  sport: text('sport').notNull(),
  equipment: text('equipment').notNull(),
  muscles: text('muscles'),           // nullable — JSON stringified string[]
  description: text('description'),   // nullable
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
```

Each table lives in its own file under `src/db/schema/`. The schema index re-exports all tables:
```ts
// src/db/schema/index.ts
export * from './exercises';
```

## Migrations

### drizzle.config.ts
```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',           // generates importable migrations.js for RN (not just SQL files)
  schema: './src/db/schema',
  out: './src/db/migrations',
});
```

### Pipeline — do this every time schema changes
1. Edit schema file in `src/db/schema/`
2. Run `npx drizzle-kit generate` in terminal (requires TTY — run in your terminal, not a script)
3. Select **"create column"** for new fields — never "rename" unless it was actually renamed
4. Migrations output to `src/db/migrations/` — **never edit these files manually**
5. Clear app data on device/simulator so migrations run fresh
6. Relaunch app (no rebuild needed)

> **Dev only — resetting migrations:** if the schema was never shipped to real users and you want a single clean migration instead of a chain, delete the entire `src/db/migrations/` folder and re-run `npx drizzle-kit generate`. Never do this after a public release.

### Running migrations in the app

Migrations run inside `DbProvider` via `useMigrations`. The app is gated behind migration success:

```tsx
// src/shared/components/DbProvider/DbProvider.tsx
import { useMigrations } from 'drizzle-orm/op-sqlite/migrator';
import { db, migrations, seedDatabase } from 'src/db';

export const DbProvider = ({ children }: { children: React.ReactNode }) => {
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (success) seedDatabase();
  }, [success]);

  if (error) {
    if (__DEV__) console.error('Migration failed:', error);
    return null;
  }
  if (!success) return <ActivityIndicator />;
  return <>{children}</>;
};
```

`DbProvider` wraps the entire app in `App.tsx`. Never call `useMigrations` anywhere else.

## Seed Data

Seeds live in `src/db/seeds/`:
```
src/db/seeds/
  exercises-seed.ts   — SEED_EXERCISES data + seedExercises()
  index.ts            — exports seedDatabase() — add future seed calls here
  __tests__/
    exercises-seed.test.ts
```

`seedDatabase()` is the single orchestrator — `DbProvider` calls only this. To add a new seed:
1. Create `src/db/seeds/<name>-seed.ts`
2. Call it inside `seedDatabase()` in `src/db/seeds/index.ts`

### Seed flag pattern
Each seed function guards against re-running using an MMKV flag:

```ts
export const seedExercises = async (): Promise<void> => {
  if (storage.getBoolean(MMKV_KEYS.EXERCISES_SEEDED)) return;

  for (const exercise of SEED_EXERCISES) {
    await db.insert(exercises).values(exercise);  // per-row insert — batch fails with autoincrement
  }

  storage.set(MMKV_KEYS.EXERCISES_SEEDED, true);
};
```

**Per-row insert is required** — Drizzle batch insert emits `VALUES (null, ?, ...)` for autoincrement PKs and op-sqlite rejects the null literal.

When seed data changes with a schema update, bump the MMKV flag key (e.g. `EXERCISES_SEEDED_V2`) so existing users re-seed.

## Repository Template

```ts
// src/db/repositories/<name>-repository.ts
import { eq, desc } from 'drizzle-orm';
import { db } from '../index';
import { exercises } from '../schema';
import type { Exercise, NewExercise } from '../schema';

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

## Common Mistakes
- Importing column types from `'drizzle-orm/op-sqlite'` — use `'drizzle-orm/sqlite-core'`
- Using batch `.values([...array])` with autoincrement PKs — use a `for...of` loop instead
- Editing migration files manually — always regenerate with `npx drizzle-kit generate`
- Running `npx drizzle-kit generate` in a non-TTY shell — it hangs; run in a real terminal
- Forgetting to add `.sql` to Metro `sourceExts` — migrations.js will fail to import SQL files
- Calling `seedDatabase()` directly from components — only `DbProvider` calls it
- Not bumping the MMKV seed flag key when seed data changes with a schema update
