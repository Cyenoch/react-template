import type { Span } from '@opentelemetry/api'
import type { Logger } from 'drizzle-orm'
import type pino from 'pino'
import SuperJSON from 'superjson'
import { ATTR_DB_STATEMENT, ATTR_DB_SYSTEM, DB_SYSTEM_VALUE_SQLITE } from '../telemetry/semantic-conventions'

export class DatabasePinoLogger implements Logger {
  constructor(private readonly logger: pino.Logger, private readonly span?: Span) {}
  logQuery(query: string, params: unknown[]): void {
    this.logger.debug({ query, params }, 'Database Query')
    this.span?.addEvent('db.query', {
      [ATTR_DB_SYSTEM]: DB_SYSTEM_VALUE_SQLITE,
      [ATTR_DB_STATEMENT]: query,
      params: SuperJSON.stringify(params),
    })
  }
}
