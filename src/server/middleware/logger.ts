import { Env } from '@/lib/constants'
import { createMiddleware, serverOnly } from '@tanstack/react-start'
import { getWebRequest } from '@tanstack/react-start/server'
import { differenceInMilliseconds } from 'date-fns/differenceInMilliseconds'
import pino from 'pino'
import { getContext, setContext } from '../context'
import { requestIdMiddleware } from './request-id'

const rootLogger = pino({
  level: Env.LOG_LEVEL ?? 'trace',
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

export const httpRequestLoggerMiddleware = createMiddleware().middleware([loggerMiddleware]).server(async ({ next, context: { logger } }) => {
  const now = new Date()
  const request = getWebRequest()
  logger.debug(request, '<<< Request Incoming <<<')
  try {
    return await next()
  }
  finally {
    logger.debug(request, '>>> Request Completed in %dms >>>', differenceInMilliseconds(new Date(), now))
  }
})

export const getLogger = serverOnly(() => {
  const logger = getContext('logger')
  if (!logger) {
    return getRootLogger()
  }
  return logger
})

declare module '../context' {
  interface ContextMap {
    logger: pino.Logger
  }
}
