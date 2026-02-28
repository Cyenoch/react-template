import type { Logger } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getLogger, isDev } from "@/core/utils";
import * as schema from "./schema";
import { getServerEnv } from "../env";

declare global {
  var _pool: Pool;
}

const dbLogger = getLogger("Database");

export function getSQLClient(): Pool {
  const serverEnv = getServerEnv();
  console.assert(!!serverEnv.DATABASE_URL, "DATABASE_URL is not defined");
  if (globalThis._pool) return globalThis._pool;
  dbLogger.info(`Opening database connection`);
  const pool = (globalThis._pool = new Pool({
    connectionString: serverEnv.DATABASE_URL!,
    max: isDev ? 1 : undefined,
  }));
  pool.on("error", (err) => {
    dbLogger.error({ err }, "Database connection error");
  });
  pool.on("connect", () => {
    dbLogger.trace("Database connection connected");
  });
  pool.on("remove", () => {
    dbLogger.trace("Database connection removed");
  });
  return pool;
}

export function getDrizzleInstance(client: Pool = getSQLClient(), logger?: Logger) {
  return drizzle({
    client,
    logger,
    schema,
  });
}

export type SQLClient = ReturnType<typeof getSQLClient>;
export type DrizzleInstance = ReturnType<typeof getDrizzleInstance>;
export type Transaction = Parameters<Parameters<DrizzleInstance["transaction"]>[0]>[0];

// HMR support for development
if (typeof import.meta.hot !== "undefined" && import.meta.hot) {
  import.meta.hot.dispose(() => {
    dbLogger.trace(`Database HMR disposed`);
    if (globalThis._pool) {
      dbLogger.trace("Closing old database connection for HMR...");
      globalThis._pool.end();
      globalThis._pool = undefined as any;
    }
  });

  import.meta.hot.accept((_) => {
    dbLogger.trace("Database module accepted HMR update");
  });
}
