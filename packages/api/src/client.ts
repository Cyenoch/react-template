import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createRouterClient, type RouterClient } from "@orpc/server";
import { createIsomorphicFn } from "@tanstack/react-start";
import { orpcRootRouter, type AppRouter } from "./router";

const getORPCClient = createIsomorphicFn()
  .server(() => {
    return createRouterClient(orpcRootRouter, {
      // context 使用函数形式，每次请求重新获取 headers
      context: async () => ({
        headers: undefined!,
        clientIP: undefined!,
        activeSpan: undefined!,
        logger: undefined!,
      }),
    });
  })
  .client((): RouterClient<AppRouter> => {
    const link = new RPCLink({
      url: `${window.location.origin}/api/rpc`,
    });
    return createORPCClient(link);
  });

export const orpcClient: RouterClient<AppRouter> = getORPCClient();
