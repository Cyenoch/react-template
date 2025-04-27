import { createMiddleware, serverOnly } from '@tanstack/react-start'
import { getContext, setContext } from '../context'
import { getDatabaseInstance, getSQLClient } from '../database'
import { DatabasePinoLogger } from '../database/logger'
import { loggerMiddleware } from './logger'
import { getTracerSpan } from './tracing'

export const databaseMiddleware = createMiddleware().middleware([loggerMiddleware]).server(async ({ next, context: { logger } }) => {
  const db = getDatabaseInstance(getSQLClient(), new DatabasePinoLogger(logger, getTracerSpan()))

  setContext('database', db)

  return await next({
    context: {
      db,
    },
  })
})

export const getDatabase = serverOnly(() => {
  const db = getContext('database')
  if (!db)
    throw new Error('Database not initialized. (Please use this function within the request context)')
  return db
})

declare module '../context' {
  interface ContextMap {
    database: ReturnType<typeof getDatabaseInstance>
  }
}
