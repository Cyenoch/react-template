import { RPCLink } from '@orpc/client/fetch';
import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequest, getRequestHeaders } from '@tanstack/react-start/server';
import { orpcRootRouter } from '.';
import { createRouterClient, type RouterClient } from '@orpc/server';
import { createORPCClient } from '@orpc/client';
import { getClientIP, getRootLogger } from '../utils/server-utils';
import { trace } from '@opentelemetry/api';

const getORPCClient = createIsomorphicFn()
  .server(() => {
    const request = getRequest();
    const headers = getRequestHeaders();
    const clientIP = getClientIP();
    const uri = new URL(request.url);
    const path = uri.pathname.split('/').filter(Boolean).join('/');
    const activeSpan = trace.getActiveSpan();

    const logger = getRootLogger().child({
      module: 'ORPC',
      path,
    });

    return createRouterClient(orpcRootRouter, {
      context: {
        headers: new Headers(headers)!,
        logger: logger,
        clientIP: clientIP ?? '',
        activeSpan: activeSpan!,
      },
    });
  })
  .client((): RouterClient<typeof orpcRootRouter> => {
    const link = new RPCLink({
      url: `${window.location.origin}/api/rpc`,
    });
    return createORPCClient(link);
  });

export const orpcClient: RouterClient<typeof orpcRootRouter> = getORPCClient();
