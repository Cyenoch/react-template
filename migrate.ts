import { SQL } from 'bun';
import { drizzle } from 'drizzle-orm/bun-sql';
import { migrate } from 'drizzle-orm/bun-sql/migrator';

console.assert(Bun.env.DATABASE_URL, 'DATABASE_URL is not defined');

migrate(
  drizzle({
    client: new SQL(Bun.env.DATABASE_URL!),
  }),
  {
    migrationsFolder: './drizzle',
  },
);
