---
name: data-layer
description: 'op-sqlite + drizzle-orm patterns for React Native. Use when creating or modifying database schema, repositories, migrations, or queries. Trigger on: op-sqlite, drizzle-orm, drizzle-kit, database, db, SQLite, schema, migration, migrations not running, table does not exist, seed, seedExercises, repository, CREATE TABLE, useMigrations, drizzle.config, db init, db setup, insert fails, query fails, findAll, findById, transaction, RQB, relational query, db index, db instance, or any work inside src/db/.'
---

# op-sqlite + drizzle-orm

**Versions:** `@op-engineering/op-sqlite@^11`, `drizzle-orm@^0.45`, `drizzle-kit@^0.31`

---

## 1. DB Instance

```ts
// src/db/index.ts
import { open } from '@op-engineering/op-sqlite';
import { drizzle } from 'drizzle-orm/op-sqlite';
import * as schema from './schema';
import { relations } from './relations';

const client = open({ name: 'app.sqlite' });
export const db = drizzle(client, { schema, relations });
```

Pass `schema` + `relations` for typed Relational Query Builder (RQB).

---

## 2. Schema Definition

Column types import from `'drizzle-orm/sqlite-core'` (**not** `drizzle-orm/op-sqlite`):

```ts
// src/db/schema.ts
import { sqliteTable, integer, text, real, index } from 'drizzle-orm/sqlite-core';

export const exercises = sqliteTable(
  'exercises',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    photoUri: text('photo_uri'),
    muscleGroup: text('muscle_group', {
      enum: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'],
    }),
    isCustom: integer('is_custom', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'number' }).notNull().$defaultFn(() => Date.now()),
    updatedAt: integer('updated_at', { mode: 'number' }).notNull().$defaultFn(() => Date.now()),
  },
  table => [index('exercises_name_idx').on(table.name)],
);

export const workouts = sqliteTable('workouts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  startedAt: integer('started_at', { mode: 'number' }).notNull(),
  finishedAt: integer('finished_at', { mode: 'number' }),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'number' }).notNull().$defaultFn(() => Date.now()),
});

export const workoutExercises = sqliteTable('workout_exercises', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  workoutId: integer('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: integer('exercise_id').notNull().references(() => exercises.id, { onDelete: 'cascade' }),
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: integer('created_at', { mode: 'number' }).notNull().$defaultFn(() => Date.now()),
});

export const sets = sqliteTable('sets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  workoutExerciseId: integer('workout_exercise_id').notNull().references(() => workoutExercises.id, { onDelete: 'cascade' }),
  reps: integer('reps').notNull(),
  weight: real('weight').notNull(),
  isCompleted: integer('is_completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'number' }).notNull().$defaultFn(() => Date.now()),
});

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;
```

### Key column modifiers

```ts
text('col').notNull()
text('col').default('value')
text('col').unique()
text('col').$defaultFn(() => computedValue())
text('col').$onUpdate(() => new Date().toISOString())
text('col').$type<MyBrandedType>()
integer('fk').references(() => other.id, { onDelete: 'cascade' })
```

### Reusable timestamp columns

```ts
// src/db/column-helpers.ts
import { integer } from 'drizzle-orm/sqlite-core';

export const timestamps = {
  createdAt: integer('created_at', { mode: 'number' }).notNull().$defaultFn(() => Date.now()),
  updatedAt: integer('updated_at', { mode: 'number' }).notNull().$defaultFn(() => Date.now()),
};
```

---

## 3. Relations

```ts
// src/db/relations.ts
import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, r => ({
  workouts: {
    workoutExercises: r.many.workoutExercises(),
  },
  exercises: {
    workoutExercises: r.many.workoutExercises(),
  },
  workoutExercises: {
    workout: r.one.workouts({ from: r.workoutExercises.workoutId, to: r.workouts.id, optional: false }),
    exercise: r.one.exercises({ from: r.workoutExercises.exerciseId, to: r.exercises.id, optional: false }),
    sets: r.many.sets(),
  },
  sets: {
    workoutExercise: r.one.workoutExercises({ from: r.sets.workoutExerciseId, to: r.workoutExercises.id, optional: false }),
  },
}));
```

- `r.one`: `from` = FK column, `to` = PK column; `optional: false` → non-nullable in TS
- `r.many`: Drizzle infers FK from schema if columns match

---

## 4. CRUD Queries

```ts
import { eq, desc, asc, and, or, like, isNull, gt, inArray } from 'drizzle-orm';

// SELECT
await db.select().from(exercises).orderBy(desc(exercises.createdAt));
await db.select({ id: exercises.id, name: exercises.name }).from(exercises);
await db.select().from(exercises).where(eq(exercises.id, id)).then(r => r[0]);

// INSERT
const [created] = await db.insert(exercises).values({ name: 'Bench Press', isCustom: false }).returning();

// UPDATE
const [updated] = await db.update(exercises).set({ name: 'New Name', updatedAt: Date.now() }).where(eq(exercises.id, id)).returning();

// DELETE
await db.delete(exercises).where(eq(exercises.id, id));

// Where operators
.where(and(eq(col, val), gt(col2, 0)))
.where(or(eq(col, 'a'), eq(col, 'b')))
.where(like(exercises.name, '%press%'))
.where(inArray(exercises.id, [1, 2, 3]))
.where(isNull(exercises.photoUri))
```

---

## 5. Relational Query Builder (RQB)

Requires `schema` + `relations` passed to `drizzle()`. Use for nested joins.

```ts
const workoutsWithExercises = await db.query.workouts.findMany({
  orderBy: desc(workouts.startedAt),
  limit: 20,
  with: {
    workoutExercises: {
      orderBy: asc(workoutExercises.orderIndex),
      with: {
        exercise: true,
        sets: { orderBy: asc(sets.createdAt) },
      },
    },
  },
});

// findFirst returns T | undefined
const workout = await db.query.workouts.findFirst({
  where: eq(workouts.id, id),
  with: { workoutExercises: true },
});

// Limit columns
await db.query.exercises.findMany({ columns: { id: true, name: true, muscleGroup: true } });
```

---

## 6. Transactions

```ts
const result = await db.transaction(async tx => {
  const [workout] = await tx.insert(workouts).values({ name: 'Leg Day', startedAt: Date.now() }).returning();
  await tx.insert(workoutExercises).values({ workoutId: workout.id, exerciseId, orderIndex: 0 });
  return workout;
});
```

---

## 7. Migrations

```bash
npx drizzle-kit generate   # outputs drizzle/migrations.js — never edit manually
```

```tsx
// App.tsx — gate app behind migration completion
import { useMigrations } from 'drizzle-orm/op-sqlite/migrator';
import migrations from '../drizzle/migrations';

const { success, error } = useMigrations(db, migrations);
if (error) return <ErrorScreen message={error.message} />;
if (!success) return <LoadingScreen />;
```

### drizzle.config.ts

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',   // generates importable migrations.js for RN
  schema: './src/db/schema.ts',
  out: './drizzle',
});
```

---

## 8. Repository Pattern

```ts
// src/db/repositories/exercises-repository.ts
import { eq, desc, like } from 'drizzle-orm';
import { db } from '../index';
import { exercises } from '../schema';
import type { Exercise, NewExercise } from '../schema';

export const exercisesRepository = {
  findAll: (): Promise<Exercise[]> =>
    db.select().from(exercises).orderBy(desc(exercises.createdAt)),

  findById: (id: number): Promise<Exercise | undefined> =>
    db.select().from(exercises).where(eq(exercises.id, id)).then(r => r[0]),

  search: (query: string): Promise<Exercise[]> =>
    db.select().from(exercises).where(like(exercises.name, `%${query}%`)).orderBy(exercises.name),

  create: (data: NewExercise): Promise<Exercise> =>
    db.insert(exercises).values(data).returning().then(r => r[0]),

  update: (id: number, data: Partial<NewExercise>): Promise<Exercise> =>
    db.update(exercises).set({ ...data, updatedAt: Date.now() }).where(eq(exercises.id, id)).returning().then(r => r[0]),

  delete: (id: number): Promise<void> =>
    db.delete(exercises).where(eq(exercises.id, id)).then(() => undefined),
};
```

---

## 9. Common Mistakes

- Importing column types from `'drizzle-orm/op-sqlite'` — **wrong**. Use `'drizzle-orm/sqlite-core'`
- Running `migrate()` before `drizzle()` instance is created
- Editing `drizzle/migrations.js` manually — regenerate instead
- Using `db.query.*` without passing `schema` + `relations` to `drizzle()`
- Forgetting `{ onDelete: 'cascade' }` on FK — leaves orphaned rows
- Not calling `npx drizzle-kit generate` after schema changes
