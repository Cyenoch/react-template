import { createIsomorphicFn, createMiddleware } from '@tanstack/react-start';
import { getClientIP } from '../utils/server-utils';
import { v7 } from 'uuid';
import { setContext } from '@sentry/tanstackstart-react';

export const requestIdMiddleware = createMiddleware({
  type: 'function',
})
  .client(async ({ next }) => {
    return next({
      sendContext: {
        requestId: window.__RequestId,
      },
      context: {
        requestId: window.__RequestId,
      },
    });
  })
  .server(async ({ next, context: { requestId } }) => {
    const clientIP = getClientIP();

    const result = await next({
      context: {
        requestId,
        clientIP,
      },
      sendContext: {
        requestId,
      },
    });

    return result;
  });

export const getRequestId = createIsomorphicFn()
  .server(() => {
    const requestId = v7();
    setContext('Request', {
      requestId,
    });
    return requestId;
  })
  .client(() => {
    const requestId = window.__RequestId;
    setContext('Request', {
      requestId,
    });

    return requestId;
  });
