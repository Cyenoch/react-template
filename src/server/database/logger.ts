import type { Span } from '@opentelemetry/api'
import type { Logger } from 'drizzle-orm'
import type pino from 'pino'
import SuperJSON from 'superjson'

export class DatabasePinoLogger implements Logger {
  constructor(private readonly logger: pino.Logger, private readonly span?: Span) {}
  logQuery(query: string, params: unknown[]): void {
    this.logger.trace({ query, params }, 'Database Query')
    this.span?.addEvent('db.call', { query, params: SuperJSON.stringify(params) })
    return this.span?.end()
  }
}
