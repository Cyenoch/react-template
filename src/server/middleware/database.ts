import { createMiddleware } from '@tanstack/react-start'
import { getContext, setContext } from '@tanstack/react-start/server'
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

export function getDatabase() {
  return getContext('database') as ReturnType<typeof getDatabaseInstance>
}
