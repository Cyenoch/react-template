import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import ErrorPrint from './components/core/error-print'
import NotFound from './components/core/not-found'
import { createQueryClient } from './lib/utils/query-client'
import { routeTree } from './routeTree.gen'

export function createRouter() {
  const queryClient = createQueryClient()
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
