import type { Session, User } from '../auth'
import { SpanStatusCode } from '@opentelemetry/api'
import { createMiddleware, serverOnly } from '@tanstack/react-start'
import { getProxyRequestHeaders } from '@tanstack/react-start/server'
import { getAuth } from '../auth'
import { getContext, setContext } from '../context'
import { getDatabase } from './database'
import { getTracer } from './tracing'

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
      span.setStatus({
        code: SpanStatusCode.OK,
        message: JSON.stringify(session),
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

export const getSessionFromContext = serverOnly(async () => getContext('session')())
export const getUserFromContext = serverOnly(async () => getContext('user')())

declare module '../context' {
  interface ContextMap {
    'session': () => Promise<Session | undefined>
    'user': () => Promise<User | undefined>
    'async-session': () => Promise<{ session: Session, user: User } | null>
    'auth': ReturnType<typeof getAuth>
  }
}
