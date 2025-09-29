import { os } from '@orpc/server';
import type { Logger } from 'pino';
import type { Span } from '@opentelemetry/api';
import { appContextMiddleware } from './middleware/app-context';

export const orpcBase = os
  .$context<{
    clientIP: string;
    logger: Logger;
    headers: Headers;
    activeSpan: Span;
  }>()
  .use(appContextMiddleware);
