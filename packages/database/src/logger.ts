import type { Logger } from "drizzle-orm";
import pino from "pino";

const getLogLevel = (): string => {
  try {
    const env = typeof Bun !== "undefined" ? Bun.env : process.env;
    return env.LOG_LEVEL ?? "trace";
  } catch {
    return "trace";
  }
};

export const rootLogger = pino({
  level: getLogLevel(),
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
