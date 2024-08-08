import { createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'

export const router = createRouter({
  routeTree,
  context: {
    miniAppRaw: undefined!, // We'll set this in React-land
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
