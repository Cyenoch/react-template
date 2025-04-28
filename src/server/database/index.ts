import type { Logger } from 'drizzle-orm'
import process from 'node:process'
import { serverOnly } from '@tanstack/react-start'
import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { rootLogger } from '../middleware/logger'
import * as schema from './schema'

let _sql: Database

export const getSQLClient = serverOnly(() => {
  console.assert(Bun.env.DATABASE_URL, 'DATABASE_URL is not defined')
  if (_sql)
    return _sql
  _sql = new Database(Bun.env.DATABASE_URL)
  rootLogger.trace('Opening database connection...')
  process.on('exit', () => {
    rootLogger.trace('Closing database connection...')
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
