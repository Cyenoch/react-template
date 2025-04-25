import type { Logger } from 'drizzle-orm'
import type pino from 'pino'

export class DatabasePinoLogger implements Logger {
  constructor(private readonly logger: pino.Logger) {}
  logQuery(query: string, params: unknown[]): void {
    this.logger.trace({ query, params }, 'Database Query')
  }
}
