import { createMiddleware, serverOnly } from '@tanstack/react-start'
import { getProxyRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '../auth'
import { getContext, setContext } from '../context'

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  let cache: Awaited<ReturnType<typeof auth.api.getSession>>
  async function retireSession() {
    if (cache)
      return cache!
    const headers = await getProxyRequestHeaders()
    const session = await auth.api.getSession({ headers })
    return cache = session
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
    'session': () => Promise<NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>['session'] | undefined>
    'user': () => Promise<NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>['user'] | undefined>
    'async-session': () => Promise<Awaited<ReturnType<typeof auth.api.getSession>>>
  }
}
