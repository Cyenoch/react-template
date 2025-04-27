import { createMiddleware, serverOnly } from '@tanstack/react-start'
import { v7 } from 'uuid'
import { getContext, setContext } from '../context'
import { getTracerSpan } from './tracing'

export const requestIdMiddleware = createMiddleware().server(async ({ next }) => {
  const id = v7()

  setContext('requestId', id)

  getTracerSpan().setAttribute('request.id', id)

  return next({
    context: {
      requestId: id,
    },
    sendContext: {
      requestId: id,
    },
  })
})

export const getRequestId = serverOnly(() => {
  const requestId = getContext('requestId')
  if (!requestId)
    throw new Error('Request ID not initialized. (Please use this function within the request context)')
  return requestId
})

declare module '../context' {
  interface ContextMap {
    requestId: string
  }
}
