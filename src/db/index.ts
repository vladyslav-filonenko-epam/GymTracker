import { open } from '@op-engineering/op-sqlite';
import { drizzle } from 'drizzle-orm/op-sqlite';

import migrations from './migrations/migrations';
import * as schema from './schema';

const client = open({ name: 'gymtracker.db' });

export const db = drizzle(client, { schema });

export { migrations };

export { seedDatabase } from './seeds';
