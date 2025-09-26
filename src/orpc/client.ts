import { RPCLink } from '@orpc/client/fetch';
import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { orpcRootRouter } from '.';
import { createRouterClient, type RouterClient } from '@orpc/server';
import { createORPCClient } from '@orpc/client';
import { getClientIP } from '../utils/server-utils';

const getORPCClient = createIsomorphicFn()
  .server(() =>
    createRouterClient(orpcRootRouter, {
      context: {
        headers: new Headers(getRequestHeaders())!,
        logger: undefined!,
        clientIP: getClientIP() ?? '',
      },
    }),
  )
  .client((): RouterClient<typeof orpcRootRouter> => {
    const link = new RPCLink({
      url: `${window.location.origin}/api/rpc`,
    });
    return createORPCClient(link);
  });

export const orpcClient: RouterClient<typeof orpcRootRouter> = getORPCClient();
