import { SQL } from 'bun'
import { drizzle } from 'drizzle-orm/bun-sql'
import { migrate } from 'drizzle-orm/bun-sql/migrator'
import { getDatabaseInstance } from './src/server/database'

migrate(drizzle({
  client: new SQL(Bun.env.DATABASE_URL!),
}), {
  migrationsFolder: './drizzle',
})
