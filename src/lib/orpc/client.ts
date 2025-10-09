import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { createRouterClient, type RouterClient } from '@orpc/server';
import { createIsomorphicFn } from '@tanstack/react-start';
import { orpcRootRouter } from '.';

const getORPCClient = createIsomorphicFn()
  .server(() => {
    return createRouterClient(orpcRootRouter, {
      context: {} as any,
    });
  })
  .client((): RouterClient<typeof orpcRootRouter> => {
    const link = new RPCLink({
      url: `${window.location.origin}/api/rpc`,
    });
    return createORPCClient(link);
  });

export const orpcClient: RouterClient<typeof orpcRootRouter> = getORPCClient();
