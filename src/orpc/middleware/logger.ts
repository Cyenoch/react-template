import { orpcBase } from '../base';
import { getRootLogger } from '@/utils/server-utils';

export const loggerMiddleware = orpcBase.middleware(
  async ({ next, context, path, lastEventId }) => {
    const logger = getRootLogger().child({
      name: 'ORPC' + ':' + path.join('/'),
      lastEventId,
      clientIP: context.clientIP,
    });
    return next({
      context: {
        logger,
      },
    });
  },
);
