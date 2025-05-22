import type { Logger } from 'drizzle-orm'
import process from 'node:process'
import { Env } from '@/lib/constants'
import { serverOnly } from '@tanstack/react-start'
import { SQL } from 'bun'
import { drizzle } from 'drizzle-orm/bun-sql'
import { getRootLogger } from '../middleware/logger'
import * as schema from './schema'

let _sql: SQL

export const getSQLClient = serverOnly(() => {
  console.assert(Env.DATABASE_URL, 'DATABASE_URL is not defined')
  if (_sql)
    return _sql
  _sql = new SQL(Env.DATABASE_URL!)
  getRootLogger().info('Opening database connection...')
  process.on('SIGTERM', () => {
    getRootLogger().info('Closing database connection... (SIGTERM)')
    _sql.close()
  })
  process.on('SIGINT', () => {
    getRootLogger().info('Closing database connection... (SIGINT)')
    _sql.close()
  })
  return _sql
})

export const getDatabaseInstance = serverOnly((client: SQL = getSQLClient(), logger?: Logger) => {
  return drizzle({
    client,
    logger,
    schema,
  })
})

export type SQLClient = ReturnType<typeof getSQLClient>
export type DatabaseInstance = ReturnType<typeof getDatabaseInstance>
export type Transaction = Parameters<Parameters<DatabaseInstance['transaction']>[0]>[0]
