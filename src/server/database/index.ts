import type { Logger } from 'drizzle-orm'
import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'

export function getSQLiteClient() {
  console.assert(Bun.env.DATABASE_URL, 'DATABASE_URL is not defined')
  return new Database(Bun.env.DATABASE_URL)
}

export function getDatabaseInstance(client: SQLiteClient, logger: Logger) {
  return drizzle({
    client,
    logger,
  })
}

export type SQLiteClient = ReturnType<typeof getSQLiteClient>
export type DatabaseInstance = ReturnType<typeof getDatabaseInstance>
