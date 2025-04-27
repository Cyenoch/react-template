import { authMiddleware } from './auth'
import { databaseMiddleware } from './database'
import { loggerMiddleware, logRequestsMiddleware } from './logger'
import { requestIdMiddleware } from './request-id'
import { openTelemetryMiddleware } from './tracing'

export const appMiddlewares = [
  openTelemetryMiddleware,
  requestIdMiddleware,
  loggerMiddleware,
  logRequestsMiddleware,
  databaseMiddleware,
  authMiddleware,
] as const
