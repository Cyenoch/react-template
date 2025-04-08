import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import ErrorPrint from './components/core/ErrorPrint'
import NotFound from './components/core/NotFound'
import { routeTree } from './routeTree.gen'
import { queryClient } from './lib/utils/query-client'

export function createRouter() {
  const router = routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      defaultPreload: 'intent',
      context: { queryClient },
      defaultNotFoundComponent: NotFound,
      defaultErrorComponent: ErrorPrint,
    }),
    queryClient,
  )

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
