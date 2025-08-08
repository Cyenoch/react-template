import { createIsomorphicFn, createMiddleware } from '@tanstack/react-start';
import { getClientIP } from '../utils/server-utils';
import { v7 } from 'uuid';
import { getActiveSpan } from '@sentry/tanstackstart-react';

declare global {
  interface Window {
    __PageSessionID__: string;
  }
}

export const requestIdMiddleware = createMiddleware({
  type: 'function',
})
  .client(async ({ next }) => {
    return next({
      sendContext: {
        pageSessionId: window.__PageSessionID__,
      },
      context: {
        pageSessionId: window.__PageSessionID__,
      },
    });
  })
  .server(async ({ next, context: { pageSessionId } }) => {
    const requestId = v7();
    const clientIP = getClientIP();

    // 如果在客户端，会在 init 的 beforeSendSpan 中设置 x.trace-id
    getActiveSpan()?.setAttributes({
      'x.request-id': requestId,
      'x.client-ip': clientIP,
      'x.page-session-id': pageSessionId,
    });

    const result = await next({
      context: {
        requestId,
        pageSessionId,
        clientIP,
      },
      sendContext: {
        requestId,
        pageSessionId,
      },
    });

    return result;
  });

/**
 * 在页面渲染的是否就会调用
 * 在服务端生成 PageSessionID，通过 <ScriptOnce> 注入到页面中，放到 window.__PageSessionID__ 中
 * 然后在客户端从 window.__PageSessionID__ 中获取 PageSessionID
 */
export const getPageSessionId = createIsomorphicFn()
  .server(() => {
    const pageSessionId = v7();
    return pageSessionId;
  })
  .client(() => {
    const pageSessionId = window.__PageSessionID__;
    return pageSessionId;
  });
