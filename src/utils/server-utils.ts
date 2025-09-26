import { createServerOnlyFn } from '@tanstack/react-start';
import { serverEnv } from '../env';
import { getRequestHeader, getRequestIP } from '@tanstack/react-start/server';
import pino from 'pino';

const rootLogger = pino({
  level: serverEnv.LOG_LEVEL ?? 'trace',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

export const getClientIP = createServerOnlyFn(() => {
  const xForwardedFor = serverEnv.X_FORWARDED_FOR;
  const clientIP =
    xForwardedFor === 'X-Forwarded-For'
      ? getRequestIP({ xForwardedFor: true })
      : xForwardedFor
        ? getRequestHeader(xForwardedFor)
        : getRequestIP();
  return clientIP;
});

export const getRootLogger = createServerOnlyFn(() => rootLogger);
