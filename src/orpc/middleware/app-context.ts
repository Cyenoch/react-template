import { getClientIP, getRootLogger } from '@/utils/server-utils';
import { os } from '@orpc/server';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { trace } from '@opentelemetry/api';

export const appContextMiddleware = os
  .$context<{
    headers?: Headers;
  }>()
  .middleware(async ({ next, context, path }) => {
    const headers = context.headers ?? new Headers(getRequestHeaders());
    const clientIP = getClientIP() ?? '';
    const activeSpan = trace.getActiveSpan()!;
    const logger = getRootLogger().child({
      module: 'ORPC',
      path,
    });

    activeSpan.updateName(`ORPC ${path}`);

    return await next({
      context: {
        headers: headers,
        clientIP: clientIP,
        logger: logger,
        activeSpan: activeSpan,
      },
    });
  });
