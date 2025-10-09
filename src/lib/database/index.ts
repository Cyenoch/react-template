import { createServerOnlyFn } from '@tanstack/react-start';
import type { Logger } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { VITE_META_DEV } from '../constants';
import { serverEnv } from '../env';
import { getRootLogger } from '../utils/server-utils';
import * as schema from './schema';

declare global {
  var _pool: Pool;
}

const rootLogger = getRootLogger().child({
  module: 'Database',
});

export const getSQLClient = createServerOnlyFn(() => {
  console.assert(serverEnv.DATABASE_URL, 'DATABASE_URL is not defined');
  if (globalThis._pool) return globalThis._pool;
  rootLogger.info(`Opening database connection`);
  const pool = (globalThis._pool = new Pool({
    connectionString: serverEnv.DATABASE_URL!,
    max: VITE_META_DEV ? 1 : undefined,
  }));
  pool.on('error', (err) => {
    rootLogger.error({ err }, 'Database connection error');
  });
  pool.on('connect', () => {
    rootLogger.trace('Database connection connected');
  });
  pool.on('remove', () => {
    rootLogger.trace('Database connection removed');
  });
  return pool;
});

export const getDrizzleInstance = createServerOnlyFn(
  (client: Pool = getSQLClient(), logger?: Logger) => {
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

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    rootLogger.trace(`Database HMR disposed`);
    if (globalThis._pool) {
      rootLogger.trace('Closing old database connection for HMR...');
      globalThis._pool.end();
      globalThis._pool = undefined as any;
    }
  });

  // Accept HMR updates
  import.meta.hot.accept((_) => {
    rootLogger.trace('Database module accepted HMR update');
  });
}
