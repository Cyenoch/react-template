import { RPCHandler } from "@orpc/server/fetch";
import { onError } from "@orpc/server";
import { createFileRoute } from "@tanstack/react-router";
import { orpcRootRouter } from "@/core/api/router";

const handler = new RPCHandler(orpcRootRouter, {
  interceptors: [
    onError((error) => {
      console.error("[oRPC Error]", error);
    }),
  ],
});

export const Route = createFileRoute("/api/rpc/$")({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const { response } = await handler.handle(request, {
          prefix: "/api/rpc",
          context: {
            headers: undefined!,
            clientIP: undefined!,
            logger: undefined!,
            activeSpan: undefined!,
          },
        });
        return response ?? new Response("Not Found", { status: 404 });
      },
    },
  },
});
