---
mode: agent
description: "Sub-agent — creates Drizzle schema, runs migration, and creates repository"
tools:
  - codebase
  - editFiles
  - runCommands
---

# Data Model Sub-Agent

You create the full data layer for a feature.

## Steps (execute in order)
1. Create or update schema in `src/db/schema/<tableName>.ts`
2. Export new tables from `src/db/schema/index.ts`
3. Run `npx drizzle-kit generate` to produce the migration file
4. Create repository in `src/db/repositories/<name>-repository.ts` (kebab-case)
5. Export repository from `src/db/repositories/index.ts`

## Schema Rules
- Every table: `id` (autoincrement PK), `createdAt`, `updatedAt`
- Booleans: `integer('col', { mode: 'boolean' })`
- Timestamps: `integer('col', { mode: 'number' })` (Unix ms)
- Decimals: `real` type (weight, measurements)
- Foreign keys must cascade delete: `.references(() => parent.id, { onDelete: 'cascade' })`
- Export `$inferSelect` as the domain type and `$inferInsert` as the insert type

## After Creating Schema
Update the Zustand slice in `src/features/<feature>/store/` to use the new types.

## Drizzle Kit Config Reference
The project uses `drizzle.config.ts` with:
- dialect: `sqlite`
- driver: `op-sqlite`
- schema: `./src/db/schema`
- out: `./src/db/migrations`
