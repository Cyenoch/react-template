import { createMiddleware, serverOnly } from '@tanstack/react-start'
import { getContext, setContext } from '../context'
import { getDatabaseInstance, getSQLiteClient } from '../database'
import { DatabasePinoLogger } from '../database/logger'
import { loggerMiddleware } from './logger'

export const databaseMiddleware = createMiddleware().middleware([loggerMiddleware]).server(async ({ next, context: { logger } }) => {
  const client = getSQLiteClient()

  const db = getDatabaseInstance(client, new DatabasePinoLogger(logger))

  setContext('database', db)

  try {
    return await next({
      context: {
        db,
      },
    })
  }
  finally {
    client.close()
  }
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
