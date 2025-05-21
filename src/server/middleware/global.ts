import { authMiddleware } from './auth'
import { databaseMiddleware } from './database'
import { httpRequestLoggerMiddleware, loggerMiddleware } from './logger'
import { requestIdMiddleware } from './request-id'

export const appMiddlewares = [
  requestIdMiddleware,
  loggerMiddleware,
  httpRequestLoggerMiddleware,
  databaseMiddleware,
  authMiddleware,
] as const
