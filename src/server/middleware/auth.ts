import type { Session, User, UserRole } from '../database/schema'
import type { SessionData } from '../function/auth'
import { createMiddleware, serverOnly } from '@tanstack/react-start'
import { useSession } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { getContext, setContext } from '../context'
import { sessionTable, userTable, userWithoutPassword } from '../database/schema'
import { getDatabase } from './database'

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

    if (!sessionData.sessionId || !sessionData.userId) {
      throw new Response('Unauthorized', { status: 401 })
    }

    const [_user] = await db.select(userWithoutPassword).from(userTable).where(eq(userTable.id, sessionData.userId)).limit(1)
    const [_session] = await db.select().from(sessionTable).where(eq(sessionTable.id, sessionData.sessionId)).limit(1)

    if (!_user) {
      throw new Response('User not found', { status: 404 })
    }
    if (!_session) {
      throw new Response('Session expired, please sign in again', { status: 401 })
    }

    return { user: _user, session: _session }
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

export function requireOneOfRoleMiddleware(...oneOf: UserRole[]) {
  return createMiddleware().middleware([requireAuthMiddleware]).server(async ({ next, context }) => {
    const role = context.user.role
    const roles = role?.split(',').filter(Boolean)
    if (!roles || !roles.some(role => (oneOf as string[]).includes(role)))
      throw new Response('Forbidden', { status: 403 })
    return next()
  })
}

export const requireAdminRoleMiddleware = requireOneOfRoleMiddleware('admin')

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
