import type { DatabaseInstance } from './database'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

export function getAuth(db: DatabaseInstance) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
    }),
    emailAndPassword: {
      enabled: true,
    },
  })
}

export type Session = NonNullable<Awaited<ReturnType<ReturnType<typeof getAuth>['api']['getSession']>>>['session']
export type User = NonNullable<Awaited<ReturnType<ReturnType<typeof getAuth>['api']['getSession']>>>['user']
