import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import ErrorPrint from './components/core/error-print';
import NotFound from './components/core/not-found';
import { createQueryClient } from './utils/query-client';
import { routeTree } from './routeTree.gen';
import { InnerWrap } from './components/core/inner-wrap';
import { createStart } from '@tanstack/react-start';
import { requestIdMiddleware } from './lib/middleware/request-id';
import {
  httpRequestLoggerMiddleware,
  loggerMiddleware,
} from './lib/middleware/logger';
import {
  initSentryIsomorphic,
  sentryMiddleware,
} from './lib/observability/sentry';
import { initPerformanceMonitoring } from './lib/observability/performance';

declare module '@tanstack/react-start' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

export function getRouter() {
  const queryClient = createQueryClient();
  const router = routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      defaultPreload: 'intent',
      context: {
        queryClient,
        requestId: undefined!,
        user: undefined!,
        session: undefined!,
      },
      InnerWrap,
      defaultNotFoundComponent: NotFound,
      defaultErrorComponent: ErrorPrint,
    }),
    queryClient,
  );

  initSentryIsomorphic(router);
  initPerformanceMonitoring();

  return router;
}

export const startInstance = createStart(() => {
  return {
    functionMiddleware: [
      requestIdMiddleware,
      loggerMiddleware,
      sentryMiddleware,
      httpRequestLoggerMiddleware,
    ],
  };
});
