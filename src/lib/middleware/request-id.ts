import { serverEnv } from '@/lib/env';
import { createMiddleware, createServerFn } from '@tanstack/react-start';
import { getRequestHeader, getRequestIP } from '@tanstack/react-start/server';
import { v7 } from 'uuid';

export const requestIdMiddleware = createMiddleware({
  type: 'function',
})
  .client(async ({ next }) => {
    const result = await next();

    return result;
  })
  .server(async ({ next }) => {
    const requestId = v7();
    const xForwardedFor = serverEnv.X_FORWARDED_FOR;
    const clientIp =
      xForwardedFor === 'X-Forwarded-For'
        ? getRequestIP({ xForwardedFor: true })
        : xForwardedFor
          ? getRequestHeader(xForwardedFor)
          : getRequestIP();

    const result = await next({
      context: {
        requestId,
        clientIp,
      },
      sendContext: {
        requestId,
      },
    });

    return result;
  });

export const getRequestId = createServerFn()
  .middleware([requestIdMiddleware])
  .handler(({ context: { requestId } }) => {
    return requestId;
  });
