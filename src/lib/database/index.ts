import type { Logger } from 'drizzle-orm';
import { createMiddleware, createServerOnlyFn } from '@tanstack/react-start';
import { SQL } from 'bun';
import { drizzle } from 'drizzle-orm/bun-sql';
import { getRootLogger, loggerMiddleware } from '../middleware/logger';
import * as schema from './schema';
import { serverEnv } from '../env';
import { DatabasePinoLogger } from './utils/database-logger';
import { VITE_META_DEV } from '../constants';

declare global {
  var _sql: SQL;
}

export const getSQLClient = createServerOnlyFn(() => {
  console.assert(serverEnv.DATABASE_URL, 'DATABASE_URL is not defined');
  if (globalThis._sql) return globalThis._sql;
  getRootLogger().info(`Opening database connection...`);
  const sql = (globalThis._sql = new SQL({
    url: serverEnv.DATABASE_URL!,
    max: VITE_META_DEV ? 1 : 10,
    onconnect: () => {
      getRootLogger().info('Database connected');
    },
    onclose: () => {
      getRootLogger().warn('Database disconnected');
    },
  }));
  return sql;
});

export const getDrizzleInstance = createServerOnlyFn(
  (client: SQL = getSQLClient(), logger?: Logger) => {
    return drizzle({
      client,
      logger,
      schema,
    });
  },
);

export type SQLClient = ReturnType<typeof getSQLClient>;
export type DrizzleInstance = ReturnType<typeof getDrizzleInstance>;
export type Transaction = Parameters<
  Parameters<DrizzleInstance['transaction']>[0]
>[0];

export const databaseMiddleware = createMiddleware({ type: 'function' })
  .middleware([loggerMiddleware])
  .server(async ({ next, context: { logger } }) => {
    const db = getDrizzleInstance(
      getSQLClient(),
      new DatabasePinoLogger(logger),
    );

    return await next({
      context: {
        db,
      },
    });
  });

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    getRootLogger().trace(`Database HMR disposed`);
    if (globalThis._sql) {
      getRootLogger().trace('Closing old database connection for HMR...');
      globalThis._sql.close();
      globalThis._sql = undefined as any;
    }
  });

  // Accept HMR updates
  import.meta.hot.accept((_) => {
    getRootLogger().trace('Database module accepted HMR update');
  });
}
