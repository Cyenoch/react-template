import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders, getRequestIP, useSession } from '@tanstack/start-server-core'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { sessionTable, userTable } from '../database/schema'
import { requireAuthMiddleware } from '../middleware/auth'
import { getDatabase } from '../middleware/database'
import { appMiddlewares } from '../middleware/global'

export const signUpSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password length must be at least 8 characters'),
  rePassword: z.string().min(8, 'Password length must be at least 8 characters'),
  referralCode: z.string().optional(),
}).refine(data => data.password === data.rePassword, {
  message: 'The two passwords you entered are inconsistent',
  path: ['rePassword'],
})

export const resetPasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(8, 'Password length must be at least 8 characters'),
  reNewPassword: z.string().min(8, 'Password length must be at least 8 characters'),
}).refine(data => data.newPassword === data.reNewPassword, {
  message: 'The two passwords you entered are inconsistent',
  path: ['reNewPassword'],
})

export interface SessionData {
  userId?: string
  sessionId?: string
}

async function requireUserByEmail(email: string) {
  const db = getDatabase()
  const [one] = await db.select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1)

  if (!one)
    throw new Response('User not found', { status: 404 })

  return one
}

export const isAuthenticated = createServerFn({
  method: 'GET',
}).middleware([
  ...appMiddlewares,
]).handler(async ({ context: { userId } }) => {
  return !!userId
})

export const getCurrentUser = createServerFn({
  method: 'GET',
}).middleware([
  ...appMiddlewares,
  requireAuthMiddleware,
]).handler(async ({ context: { user } }) => {
  return user
})

export const signUp = createServerFn({ method: 'POST' })
  .middleware([...appMiddlewares])
  .validator(signUpSchema)
  .handler(async ({ context: { db }, data }) => {
    const { update } = await useSession<SessionData>({
      password: Bun.env.AUTH_SECRET,
      name: 'auth',
    })
    return db.transaction(async (tx) => {
      const [one] = await tx.select()
        .from(userTable)
        .where(eq(userTable.email, data.email))
        .limit(1)

      if (one) {
        throw new Response('Email already exists', { status: 400 })
      }

      const [newOne] = await tx.insert(userTable).values([{
        name: data.email,
        email: data.email,
        password: await Bun.password.hash(data.password),
        emailVerified: true,
        role: 'user',
      }]).returning()

      const [newSession] = await tx.insert(sessionTable).values([{
        userId: newOne!.id,
        ipAddress: getRequestIP(),
        userAgent: getRequestHeaders()['User-Agent'],
      }]).returning()

      await update({
        userId: newOne!.id,
        sessionId: newSession!.id,
      })

      return {
        session: newSession,
        user: newOne,
      }
    })
  })

export const signIn = createServerFn({ method: 'POST' })
  .middleware([...appMiddlewares])
  .validator(z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password length must be at least 8 characters'),
  }))
  .handler(async ({ context: { db }, data }) => {
    const { update } = await useSession<SessionData>({
      password: Bun.env.AUTH_SECRET,
      name: 'auth',
    })
    return db.transaction(async (tx) => {
      const [one] = await tx.select()
        .from(userTable)
        .where(eq(userTable.email, data.email))
        .limit(1)

      if (!one) {
        throw new Response('User not found', { status: 400 })
      }

      if (!await Bun.password.verify(data.password, one.password ?? '')) {
        throw new Response('Password error', { status: 400 })
      }

      const [newSession] = await tx.insert(sessionTable).values([{
        userId: one.id,
        ipAddress: getRequestIP(),
        userAgent: getRequestHeaders()['User-Agent'],
      }]).returning()

      await update({
        userId: one.id,
        sessionId: newSession!.id,
      })

      return {
        session: newSession!,
        user: one!,
      }
    })
  })

export const resetPassword = createServerFn({
  method: 'POST',
})
  .middleware([...appMiddlewares, requireAuthMiddleware])
  .validator(resetPasswordSchema)
  .handler(async ({ data, context: { user: { email } } }) => {
    const _user = await requireUserByEmail(email)

    if (!await Bun.password.verify(data.oldPassword, _user.password ?? '')) {
      throw new Error('Password error')
    }

    await getDatabase().update(userTable).set({
      password: await Bun.password.hash(data.newPassword),
    }).where(eq(userTable.id, _user.id))

    return { ok: true }
  })

export const signOut = createServerFn({
  method: 'POST',
})
  .middleware([...appMiddlewares, requireAuthMiddleware])
  .handler(async ({ context: { db, session: { id } } }) => {
    const { clear } = await useSession({
      password: Bun.env.AUTH_SECRET,
      name: 'auth',
    })
    await db.delete(sessionTable).where(eq(sessionTable.id, id))
    await clear()
  })
