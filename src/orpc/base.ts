import { os } from '@orpc/server';
import type { Logger } from 'pino';
import type { Span } from '@opentelemetry/api';

export const orpcBase = os.$context<{
  clientIP: string;
  logger: Logger;
  headers: Headers;
  activeSpan: Span;
}>();
