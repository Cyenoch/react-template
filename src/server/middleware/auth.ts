import { createMiddleware } from '@tanstack/react-start'
import { getContext, getProxyRequestHeaders, setContext } from '@tanstack/react-start/server'
import { auth } from '../auth'

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  let cache: Awaited<ReturnType<typeof auth.api.getSession>> | undefined
  const retireSession = async () => {
    if (cache)
      return cache
    const headers = await getProxyRequestHeaders()
    const session = await auth.api.getSession({ headers })
    return cache = session
  }

  setContext('async-session', retireSession)

  return next({
    context: {
      session: async () => await retireSession().then(value => value?.session),
      user: async () => await retireSession().then(value => value?.user),
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

export async function getUserFromContext() {
  const promise = getContext('async-session') as Promise<Awaited<ReturnType<typeof auth.api.getSession>>> | undefined
  return promise ? await promise.then(value => value?.user) : undefined
}

export async function getSessionFromContext() {
  const promise = getContext('async-session') as Promise<Awaited<ReturnType<typeof auth.api.getSession>>> | undefined
  return promise ? await promise.then(value => value?.session) : undefined
}
