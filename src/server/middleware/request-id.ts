import { createMiddleware, serverOnly } from '@tanstack/react-start'
import { v7 } from 'uuid'
import { getContext, setContext } from '../context'

export const requestIdMiddleware = createMiddleware().server(async ({ next }) => {
  const id = v7()

  setContext('requestId', id)

  return next({
    context: {
      requestId: id,
    },
  })
})

export const getRequestId = serverOnly(() => getContext('requestId'))

declare module '../context' {
  interface ContextMap {
    requestId: string
  }
}
