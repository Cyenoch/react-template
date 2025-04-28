import type { Logger } from 'drizzle-orm'
import process from 'node:process'
import { serverOnly } from '@tanstack/react-start'
import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { getRootLogger } from '../middleware/logger'
import * as schema from './schema'

let _sql: Database

export const getSQLClient = serverOnly(() => {
  console.assert(Bun.env.DATABASE_URL, 'DATABASE_URL is not defined')
  if (_sql)
    return _sql
  _sql = new Database(Bun.env.DATABASE_URL)
  getRootLogger().trace('Opening database connection...')
  process.on('SIGTERM', () => {
    getRootLogger().trace('Closing database connection... (SIGTERM)')
    _sql.close()
  })
  process.on('SIGINT', () => {
    getRootLogger().trace('Closing database connection... (SIGINT)')
    _sql.close()
  })
  return _sql
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
