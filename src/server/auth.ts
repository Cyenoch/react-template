import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { reactStartCookies } from 'better-auth/react-start'
import { getDatabaseInstance } from './database'

export const auth = betterAuth({
  database: drizzleAdapter(getDatabaseInstance(), {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    reactStartCookies(),
  ],
})

export type Session = NonNullable<Awaited<ReturnType<typeof auth['api']['getSession']>>>['session']
export type User = NonNullable<Awaited<ReturnType<typeof auth['api']['getSession']>>>['user']
