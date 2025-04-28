import { createMiddleware, serverOnly } from '@tanstack/react-start'
import { getWebRequest } from '@tanstack/react-start/server'
import { differenceInMilliseconds } from 'date-fns/differenceInMilliseconds'
import pino from 'pino'
import { getContext, setContext } from '../context'
import { requestIdMiddleware } from './request-id'

const rootLogger = pino({
  level: Bun.env.LOG_LEVEL ?? 'trace',
  // ?? Bun.env.NODE_ENV === 'production'
  // ? 'info'
  // : 'trace',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})

export const getRootLogger = serverOnly(() => rootLogger)

export const loggerMiddleware = createMiddleware().middleware([requestIdMiddleware]).server(async ({ next, context: { requestId }, functionId }) => {
  const logger = rootLogger.child({
    functionId,
    requestId,
  })

  setContext('logger', logger)

  return next({
    context: {
      logger,
    },
  })
})

export const logRequestsMiddleware = createMiddleware().middleware([loggerMiddleware]).server(async ({ next, context: { logger } }) => {
  const now = new Date()
  const request = getWebRequest()
  logger.trace(request, '<<< Request Incoming <<<')
  try {
    return await next()
  }
  finally {
    logger.trace(request, '>>> Request Completed in %dms >>>', differenceInMilliseconds(new Date(), now))
  }
})

export const getLogger = serverOnly(() => {
  const logger = getContext('logger')
  if (!logger)
    throw new Error('Logger not initialized. (Please use this function within the request context)')
  return logger
})

declare module '../context' {
  interface ContextMap {
    logger: pino.Logger
  }
}
