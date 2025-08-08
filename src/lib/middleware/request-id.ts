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

/**
 * 在页面渲染的是否就会调用
 * 在服务端生成 RequestID，通过 <ScriptOnce> 注入到页面中，放到 window.__RequestId 中
 * 然后在客户端从 window.__RequestId 中获取 RequestID，并设置到 Sentry 的 Context 中
 */
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
