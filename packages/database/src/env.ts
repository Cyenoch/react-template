import pino from "pino";
import { z } from "zod";

const databaseEnvSchema = z.object({
  DATABASE_URL: z.url(),
  LOG_LEVEL: z.string().min(3).max(10).default("trace"),
});

export type IDatabaseEnv = z.output<typeof databaseEnvSchema>;

if (typeof window === "undefined") {
  const parsed = databaseEnvSchema.safeParse(Bun.env);
  if (!parsed.success) {
    pino().error(z.treeifyError(parsed.error), "Invalid database environment variables");
  }
}

export const databaseEnv: IDatabaseEnv =
  typeof window === "undefined" ? databaseEnvSchema.parse(Bun.env) : ({} as IDatabaseEnv);
