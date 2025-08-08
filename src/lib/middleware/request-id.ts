import { createIsomorphicFn, createMiddleware } from '@tanstack/react-start';
import { getClientIP } from '../utils/server-utils';
import { v7 } from 'uuid';
import { getActiveSpan } from '@sentry/tanstackstart-react';

declare global {
  interface Window {
    __TraceId: string;
  }
}

export const requestIdMiddleware = createMiddleware({
  type: 'function',
})
  .client(async ({ next }) => {
    return next({
      sendContext: {
        traceId: window.__TraceId,
      },
      context: {
        traceId: window.__TraceId,
      },
    });
  })
  .server(async ({ next, context: { traceId } }) => {
    const requestId = v7();
    const clientIP = getClientIP();

    // 如果在客户端，会在 init 的 beforeSendSpan 中设置 x.trace-id
    getActiveSpan()?.setAttributes({
      'x.request-id': requestId,
      'x.client-ip': clientIP,
      'x.trace-id': traceId,
    });

    const result = await next({
      context: {
        requestId,
        traceId,
        clientIP,
      },
      sendContext: {
        requestId,
        traceId,
      },
    });

    return result;
  });

/**
 * 在页面渲染的是否就会调用
 * 在服务端生成 TraceID，通过 <ScriptOnce> 注入到页面中，放到 window.__TraceId 中
 * 然后在客户端从 window.__TraceId 中获取 TraceID
 */
export const getTraceId = createIsomorphicFn()
  .server(() => {
    const traceId = v7();
    return traceId;
  })
  .client(() => {
    const traceId = window.__TraceId;
    return traceId;
  });
