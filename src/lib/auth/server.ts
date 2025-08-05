import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDrizzleInstance } from '../database';
import { createIsomorphicFn } from '@tanstack/react-start';

export const auth = createIsomorphicFn().server(() =>
  betterAuth({
    database: drizzleAdapter(getDrizzleInstance(), {
      provider: 'pg',
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      requireEmailVerification: false,
    },
  }),
)();
