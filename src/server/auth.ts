import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { getDatabaseInstance } from './database'

export const auth = betterAuth({
  database: drizzleAdapter(getDatabaseInstance(), {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
  },
})
