import type { Logger } from "drizzle-orm";
import pino from "pino";
import { databaseEnv } from "./env";

export const rootLogger = pino({
  level: databaseEnv.LOG_LEVEL ?? "trace",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

export class DatabasePinoLogger implements Logger {
  constructor(private readonly logger: pino.Logger = rootLogger) {}
  logQuery(query: string, params: unknown[]): void {
    this.logger.trace({ query, params }, "Database Query");
  }
}
