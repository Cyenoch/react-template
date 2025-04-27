import type { Logger } from 'drizzle-orm'
import { serverOnly } from '@tanstack/react-start'
import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as schema from './schema'

export const getSQLiteClient = serverOnly(() => {
  console.assert(Bun.env.DATABASE_URL, 'DATABASE_URL is not defined')
  return new Database(Bun.env.DATABASE_URL)
})

export const getDatabaseInstance = serverOnly((client: SQLiteClient, logger: Logger) => {
  return drizzle({
    client,
    logger,
    schema,
  })
})

export type SQLiteClient = ReturnType<typeof getSQLiteClient>
export type DatabaseInstance = ReturnType<typeof getDatabaseInstance>
