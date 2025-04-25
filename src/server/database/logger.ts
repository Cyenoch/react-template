import type { Logger } from 'drizzle-orm'
import type pino from 'pino'
import { trace } from '@opentelemetry/api'
import SuperJSON from 'superjson'

export class DatabasePinoLogger implements Logger {
  constructor(private readonly logger: pino.Logger) {}
  logQuery(query: string, params: unknown[]): void {
    this.logger.trace({ query, params }, 'Database Query')
    const span = trace.getActiveSpan()
    span?.addEvent('db.call', { query, params: SuperJSON.stringify(params) })
    return span?.end()
  }
}
