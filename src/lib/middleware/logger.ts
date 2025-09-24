import { serverEnv } from '@/lib/env';
import { createMiddleware, createServerOnlyFn } from '@tanstack/react-start';
import { differenceInMilliseconds } from 'date-fns/differenceInMilliseconds';
import { requestIdMiddleware } from './request-id';
import pino from 'pino';
import { getRequest } from '@tanstack/react-start/server';

const rootLogger = pino({
  level: serverEnv.LOG_LEVEL ?? 'trace',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

export const getRootLogger = createServerOnlyFn(() => rootLogger);

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
    const request = getRequest();
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
