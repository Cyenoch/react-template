
import { createServerOnlyFn } from '@tanstack/react-start';
import { serverEnv } from '../env';
import { getRequestHeader, getRequestIP } from '@tanstack/react-start/server';

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
