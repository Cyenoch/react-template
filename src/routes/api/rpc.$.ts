import { createFileRoute } from '@tanstack/react-router';
import { RPCHandler } from '@orpc/server/fetch';
import { orpcRootRouter } from '@/orpc';
import { getClientIP } from '@/utils/server-utils';

const handler = new RPCHandler(orpcRootRouter);

async function handle({ request }: { request: Request }) {
  const { response } = await handler.handle(request, {
    prefix: '/api/rpc',
    context: {
      clientIP: getClientIP() ?? '',
      logger: undefined!,
      headers: request.headers,
    },
  });
  return response;
}

export const Route = createFileRoute('/api/rpc/$')({
  server: {
    handlers: {
      HEAD: handle,
      GET: handle,
      POST: handle,
      PUT: handle,
      DELETE: handle,
      PATCH: handle,
      OPTIONS: handle,
    },
  },
});
