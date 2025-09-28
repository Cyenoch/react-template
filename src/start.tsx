import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import ErrorPrint from './components/core/error-print';
import NotFound from './components/core/not-found';
import { createQueryClient } from './utils/query-client';
import { routeTree } from './routeTree.gen';
import { createStart } from '@tanstack/react-start';

declare module '@tanstack/react-router' {
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
        user: undefined!,
        session: undefined!,
      },
      defaultNotFoundComponent: NotFound,
      defaultErrorComponent: ErrorPrint,
    }),
    queryClient,
  );

  return router;
}

export const startInstance = createStart(() => {
  return {};
});
