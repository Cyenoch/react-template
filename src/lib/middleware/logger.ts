import { serverEnv } from '@/lib/env';
import { createMiddleware, serverOnly } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import { differenceInMilliseconds } from 'date-fns/differenceInMilliseconds';
import { getContext, setContext } from '../context';
import { requestIdMiddleware } from './request-id';
import pino from 'pino';

const rootLogger = pino({
  level: serverEnv.LOG_LEVEL ?? 'trace',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

export const getRootLogger = serverOnly(() => rootLogger);

export const loggerMiddleware = createMiddleware({ type: 'function' })
  .middleware([requestIdMiddleware])
  .server(
    async ({
      next,
      context: { requestId, clientIP, pageSessionId },
      functionId,
    }) => {
      const logger = rootLogger.child({
        functionId,
        requestId,
        clientIP,
        pageSessionId,
      });

      setContext('logger', logger);

      return next({
        context: {
          logger,
        },
      });
    },
  );

export const httpRequestLoggerMiddleware = createMiddleware({
  type: 'function',
})
  .middleware([loggerMiddleware])
  .server(async ({ next, context: { logger } }) => {
    const now = new Date();
    const request = getWebRequest();
    logger.debug(request, '<<< Request Incoming <<<');
    try {
      return await next();
    } finally {
      logger.debug(
        request,
        '>>> Request Completed in %dms ⚡ >>>',
        differenceInMilliseconds(new Date(), now),
      );
    }
  });

export const getLogger = serverOnly(() => {
  const logger = getContext('logger');
  if (!logger) {
    return getRootLogger();
  }
  return logger;
});

declare module '../context' {
  interface ContextMap {
    logger: pino.Logger;
  }
}
