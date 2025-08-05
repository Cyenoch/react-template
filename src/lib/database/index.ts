import type { Logger } from 'drizzle-orm';
import { serverOnly } from '@tanstack/react-start';
import { SQL } from 'bun';
import { drizzle } from 'drizzle-orm/bun-sql';
import { getRootLogger } from '../middleware/logger';
import * as schema from './schema';
import { serverEnv } from '../env';

declare global {
  var _sql: SQL;
}

export const getSQLClient = serverOnly(() => {
  console.assert(serverEnv.DATABASE_URL, 'DATABASE_URL is not defined');
  if (globalThis._sql) return globalThis._sql;
  const sql = (globalThis._sql = new SQL(serverEnv.DATABASE_URL!));
  getRootLogger().info(`Opening database connection...\n${new Error().stack}`);
  sql.connect().then(() => {
    getRootLogger().info('Database connected');
  });
  return sql;
});

export const getDrizzleInstance = serverOnly(
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

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    getRootLogger().trace(`Database HMR disposed`);
    if (globalThis._sql) {
      getRootLogger().trace('Closing old database connection for HMR...');
      globalThis._sql.close();
      globalThis._sql = undefined as any;
    }
  });
}
