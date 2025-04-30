import type { Session, User } from '../database/schema'
import type { SessionData } from '../function/auth'
import { SpanStatusCode } from '@opentelemetry/api'
import { createMiddleware, serverOnly } from '@tanstack/react-start'
import { getProxyRequestHeaders, useSession } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { getContext, setContext } from '../context'
import { session, user, userWithoutPassword } from '../database/schema'
import { ATTR_APP_PREFIX } from '../telemetry/semantic-conventions'
import { getDatabase } from './database'
import { getTracer, getTracerSpan } from './tracing'

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const db = getDatabase()
  const { data: sessionData } = await useSession<SessionData>({
    password: Bun.env.AUTH_SECRET,
    name: 'auth',
  })

  let cache: { session: Session, user: Omit<User, 'password'> } | null = null

  async function retireSession() {
    if (cache)
      return cache!
    return await getTracer().startActiveSpan('auth.retire_session', async (span) => {
      try {
        const headers = await getProxyRequestHeaders()
        span.setAttribute(`${ATTR_APP_PREFIX}headers`, JSON.stringify(headers))

        if (!sessionData.sessionId || !sessionData.userId) {
          throw new Response('Unauthorized', { status: 401 })
        }

        const [_user] = await db.select(userWithoutPassword).from(user).where(eq(user.id, sessionData.userId)).limit(1)
        const [_session] = await db.select().from(session).where(eq(session.id, sessionData.sessionId)).limit(1)

        if (!_user) {
          throw new Response('User not found', { status: 404 })
        }
        if (!_session) {
          throw new Response('Session expired, please sign in again', { status: 401 })
        }

        getTracerSpan().setAttributes({
          [`${ATTR_APP_PREFIX}auth.session`]: JSON.stringify(_session),
          [`${ATTR_APP_PREFIX}auth.user`]: JSON.stringify(_user),
        })
        span.setStatus({
          code: session ? SpanStatusCode.OK : SpanStatusCode.UNSET,
          message: session ? 'Session found' : 'Session not found',
        })
        return cache = { session: _session, user: _user }
      }
      finally {
        span.end()
      }
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
  setContext('async-session', retireSession)

  return next({
    context: {
      userId: sessionData.userId,
      sessionId: sessionData.sessionId,
      session: sessionGetter,
      user: userGetter,
    },
  })
})

export const requireAuthMiddleware = createMiddleware().middleware([authMiddleware]).server(async ({ next, context: { session, user, userId, sessionId } }) => {
  const _sess = await session()

  if (!_sess) {
    throw new Response('Unauthorized', { status: 401 })
  }

  const _user = await user()!

  return next({
    context: {
      userId: userId!,
      sessionId: sessionId!,
      session: _sess!,
      user: _user!,
    },
  })
})

export function requireRoleMiddleware(requiredRoles: string[]) {
  return createMiddleware().middleware([requireAuthMiddleware]).server(async ({ next, context }) => {
    const role = context.user.role
    const roles = role?.split(',').filter(Boolean)
    if (!roles || !roles.some(role => requiredRoles.includes(role)))
      throw new Response('Forbidden', { status: 403 })
    return next()
  })
}

export const requireAdminRoleMiddleware = requireRoleMiddleware(['admin'])

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

declare module '../context' {
  interface ContextMap {
    'session': () => Promise<Session | undefined>
    'user': () => Promise<Omit<User, 'password'> | undefined>
    'async-session': () => Promise<{ session: Session, user: Omit<User, 'password'> } | null>
  }
}
