import type { Session, User } from '../auth'
import { SpanStatusCode } from '@opentelemetry/api'
import { createMiddleware, serverOnly } from '@tanstack/react-start'
import { getProxyRequestHeaders } from '@tanstack/react-start/server'
import { getAuth } from '../auth'
import { getContext, setContext } from '../context'
import { getDatabase } from './database'
import { getTracer, getTracerSpan } from './tracing'

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const auth = getAuth(getDatabase())
  let cache: { session: Session, user: User } | null = null

  async function retireSession() {
    if (cache)
      return cache!
    return await getTracer().startActiveSpan('Retire Session', async (span) => {
      const headers = await getProxyRequestHeaders()
      span.setAttribute('headers', JSON.stringify(headers))
      const session = await getAuth(getDatabase()).api.getSession({ headers })
      getTracerSpan().setAttributes({
        'auth.session': JSON.stringify(session?.session),
        'auth.user': JSON.stringify(session?.user),
      })
      span.setStatus({
        code: session ? SpanStatusCode.OK : SpanStatusCode.UNSET,
        message: session ? 'Session found' : 'Session not found',
      })
      span.end()
      return cache = session
    })
  }

  const sessionGetter = async () => {
    return await retireSession().then(value => value?.session)
  }
  const userGetter = async () => {
    return await retireSession().then(value => value?.user)
  }

  setContext('session', sessionGetter)
  setContext('user', userGetter)

  return next({
    context: {
      session: sessionGetter,
      user: userGetter,
      auth,
    },
  })
})

export const requireAuthMiddleware = createMiddleware().middleware([authMiddleware]).server(async ({ next, context: { session, user } }) => {
  const _sess = await session()

  if (!_sess) {
    throw new Response('Unauthorized', { status: 401 })
  }

  const _user = await user()!

  return next({
    context: {
      session: _sess!,
      user: _user!,
    },
  })
})

export const getSessionFromContext = serverOnly(async () => {
  const session = getContext('session')
  if (!session)
    throw new Error('Session not initialized. (Please use this function within the request context)')
  return await session()
})

export const getUserFromContext = serverOnly(async () => {
  const user = getContext('user')
  if (!user)
    throw new Error('User not initialized. (Please use this function within the request context)')
  return await user()
})

export const getAuthFromContext = serverOnly(() => {
  const auth = getContext('auth')
  if (!auth)
    throw new Error('Auth not initialized. (Please use this function within the request context)')
  return auth
})

declare module '../context' {
  interface ContextMap {
    'session': () => Promise<Session | undefined>
    'user': () => Promise<User | undefined>
    'async-session': () => Promise<{ session: Session, user: User } | null>
    'auth': ReturnType<typeof getAuth>
  }
}
