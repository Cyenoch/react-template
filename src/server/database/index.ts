import type { Logger } from 'drizzle-orm'
import { serverOnly } from '@tanstack/react-start'
import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as schema from './schema'

export const getSQLClient = serverOnly(() => {
  console.assert(Bun.env.DATABASE_URL, 'DATABASE_URL is not defined')
  return new Database(Bun.env.DATABASE_URL)
})

export const getDatabaseInstance = serverOnly((client: SQLiteClient = getSQLClient(), logger?: Logger) => {
  return drizzle({
    client,
    logger,
    schema,
  })
})

export type SQLiteClient = ReturnType<typeof getSQLClient>
export type DatabaseInstance = ReturnType<typeof getDatabaseInstance>
