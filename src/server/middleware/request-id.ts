import { createMiddleware } from '@tanstack/react-start'
import { getContext } from '@tanstack/react-start/server'
import { v7 } from 'uuid'

export const requestIdMiddleware = createMiddleware().server(({ next }) => {
  const id = v7()
  return next({
    context: {
      requestId: id,
    },
  })
})

export function getRequestId() {
  return getContext('request-id') as string
}
