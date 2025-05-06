import { authMiddleware } from './auth'
import { databaseMiddleware } from './database'
import { loggerMiddleware, logRequestsMiddleware } from './logger'
import { requestIdMiddleware } from './request-id'
import { openTelemetryMiddleware } from './tracing'

export const appMiddlewares = [
  requestIdMiddleware,
  loggerMiddleware,
  openTelemetryMiddleware,
  logRequestsMiddleware,
  databaseMiddleware,
  authMiddleware,
] as const
