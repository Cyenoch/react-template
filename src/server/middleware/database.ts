import { createMiddleware, serverOnly } from '@tanstack/react-start';
import { getContext, setContext } from '../context';
import { getDrizzleInstance, getSQLClient } from '../../lib/database';
import { DatabasePinoLogger } from '../../lib/database/utils/database-logger';
import { loggerMiddleware } from './logger';

export const databaseMiddleware = createMiddleware({ type: 'function' })
  .middleware([loggerMiddleware])
  .server(async ({ next, context: { logger } }) => {
    const db = getDrizzleInstance(
      getSQLClient(),
      new DatabasePinoLogger(logger),
    );

    setContext('database', db);

    return await next({
      context: {
        db,
      },
    });
  });

export const getDatabase = serverOnly(() => {
  const db = getContext('database');
  if (!db)
    throw new Error(
      'Database not initialized. (Please use this function within the request context)',
    );
  return db;
});

declare module '../context' {
  interface ContextMap {
    database: ReturnType<typeof getDrizzleInstance>;
  }
}
