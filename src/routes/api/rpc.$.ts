import { createFileRoute } from '@tanstack/react-router';
import { RPCHandler } from '@orpc/server/fetch';
import { orpcRootRouter } from '@/orpc';
import { getClientIP, getRootLogger } from '@/utils/server-utils';
import { trace } from '@opentelemetry/api';

const handler = new RPCHandler(orpcRootRouter);

async function handle({ request }: { request: Request }) {
  const clientIP = getClientIP();
  const uri = new URL(request.url);
  const path = uri.pathname.split('/').filter(Boolean).join('/');
  const activeSpan = trace.getActiveSpan();

  const logger = getRootLogger().child({
    module: 'ORPC',
    path,
  });

  const { response } = await handler.handle(request, {
    prefix: '/api/rpc',
    context: {
      headers: request.headers,
      logger: logger,
      clientIP: clientIP ?? '',
      activeSpan: activeSpan!,
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
