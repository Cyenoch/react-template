import { authMiddleware } from './auth'
import { databaseMiddleware } from './database'
import { loggerMiddleware, logRequestsMiddleware } from './logger'
import { requestIdMiddleware } from './request-id'

export const appMiddlewares = [
  requestIdMiddleware,
  loggerMiddleware,
  logRequestsMiddleware,
  databaseMiddleware,
  authMiddleware,
] as const
