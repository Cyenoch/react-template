import { createServerOnlyFn } from '@tanstack/react-start';
import { getRequestHeader, getRequestIP } from '@tanstack/react-start/server';
import pino from 'pino';
import { serverEnv } from '../env';

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
    !!xForwardedFor || xForwardedFor === 'X-Forwarded-For'
      ? getRequestIP({ xForwardedFor: true })
      : xForwardedFor
        ? getRequestHeader(xForwardedFor)
        : getRequestIP();
  return clientIP;
});

export const getClientIPFromRequest = createServerOnlyFn((request: Request) => {
  const xForwardedFor = serverEnv.X_FORWARDED_FOR;
  if (!!xForwardedFor || xForwardedFor === 'X-Forwarded-For') {
    return request.headers.get('x-forwarded-for');
  } else if (xForwardedFor) {
    return request.headers.get(xForwardedFor);
  } else {
    return undefined;
  }
});

export const getRootLogger = createServerOnlyFn(() => rootLogger);
