import type { Logger } from 'drizzle-orm'
import { serverOnly } from '@tanstack/react-start'
import { SQL } from 'bun'
import { drizzle } from 'drizzle-orm/bun-sql'
import { Env } from '@/lib/constants'
import { getRootLogger } from '../middleware/logger'
import * as schema from './schema'

let _sql: SQL

export const getSQLClient = serverOnly(() => {
  console.assert(Env.DATABASE_URL, 'DATABASE_URL is not defined')
  if (_sql)
    return _sql
  _sql = new SQL(Env.DATABASE_URL!)
  getRootLogger().info('Opening database connection...')
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
