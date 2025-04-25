import { createMiddleware } from '@tanstack/react-start'
import { getContext, getWebRequest, setContext } from '@tanstack/react-start/server'
import { differenceInMilliseconds } from 'date-fns/differenceInMilliseconds'
import pino from 'pino'
import { requestIdMiddleware } from './request-id'

const rootLogger = pino({
  level: Bun.env.LOG_LEVEL
    ?? Bun.env.NODE_ENV === 'production'
    ? 'info'
    : 'trace',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})

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
  logger.debug(request, 'Request Incoming')
  try {
    return await next()
  }
  finally {
    logger.debug(request, 'Request Completed in %dms', differenceInMilliseconds(new Date(), now))
  }
})

export function getLogger() {
  return getContext('logger') as pino.Logger
}
