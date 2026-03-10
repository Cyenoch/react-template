import type { Logger } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getLogger } from "@/core/utils/logger";
import * as schema from "./schema";
import { getServerEnv } from "../env";
import { createServerOnlyFn } from "@tanstack/react-start";

declare global {
  var _pool: Pool;
}

const logger = getLogger(import.meta.file);

export const getSQLClient = createServerOnlyFn((): Pool => {
  const serverEnv = getServerEnv();
  console.assert(!!serverEnv.DATABASE_URL, "DATABASE_URL is not defined");
  if (globalThis._pool) return globalThis._pool;
  logger.info(`Opening database connection`);
  const pool = (globalThis._pool = new Pool({
    connectionString: serverEnv.DATABASE_URL!,
    max: import.meta.env.DEV ? 1 : undefined,
  }));
  pool.on("error", (err) => {
    logger.error({ err }, "Database connection error");
  });
  pool.on("connect", () => {
    logger.trace("Database connection connected");
  });
  pool.on("remove", () => {
    logger.trace("Database connection removed");
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
export type Transaction = Parameters<Parameters<DrizzleInstance["transaction"]>[0]>[0];

// HMR support for development
if (typeof import.meta.hot !== "undefined" && import.meta.hot) {
  import.meta.hot.dispose(async () => {
    logger.trace(`Database HMR disposed`);
    if (globalThis._pool) {
      logger.trace("Closing old database connection for HMR...");
      await globalThis._pool.end();
      globalThis._pool = undefined as any;
    }
  });

  import.meta.hot.accept((_) => {
    logger.trace("Database module accepted HMR update");
  });
}
