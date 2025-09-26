import { os } from '@orpc/server';
import type { Logger } from 'pino';

export const orpcBase = os.$context<{
  clientIP: string;
  logger: Logger;
  headers: Headers;
}>();
