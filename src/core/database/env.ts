import pino from "pino";
import { z } from "zod";

const databaseEnvSchema = z.object({
  DATABASE_URL: z.url(),
  LOG_LEVEL: z.string().min(3).max(10).default("trace"),
});

export type IDatabaseEnv = z.output<typeof databaseEnvSchema>;

const getEnv = () => (typeof Bun !== "undefined" ? Bun.env : process.env);

let _databaseEnv: IDatabaseEnv | undefined;

export function getDatabaseEnv(): IDatabaseEnv {
  if (typeof window !== "undefined") {
    return {} as IDatabaseEnv;
  }
  if (_databaseEnv) return _databaseEnv;

  const parsed = databaseEnvSchema.safeParse(getEnv());
  if (!parsed.success) {
    pino().error(z.treeifyError(parsed.error), "Invalid database environment variables");
    throw parsed.error;
  }
  _databaseEnv = parsed.data;
  return _databaseEnv;
}

/** @deprecated Use getDatabaseEnv() instead for lazy loading */
export const databaseEnv: IDatabaseEnv = new Proxy({} as IDatabaseEnv, {
  get(_, prop: keyof IDatabaseEnv) {
    return getDatabaseEnv()[prop];
  },
});
