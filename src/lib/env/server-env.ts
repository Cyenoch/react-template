import { z } from 'zod';

const serverEnvSchema = z.object({
  APP_IDENTITY: z.string(),
  APP_VERSION: z.string().optional(),

  DATABASE_URL: z.url(),

  LOG_LEVEL: z.string().min(3).max(10).default('trace'),

  // Better Auth
  BETTER_AUTH_SECRET: z.string().min(32).max(256),
  BETTER_AUTH_URL: z.url(),

  //
  X_FORWARDED_FOR: z.string().optional(),

  // Sentry
  SENTRY_ORG: z.string().optional(), 
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  VITE_SENTRY_DSN: z.url().optional(),
});

export type IServerEnv = z.output<typeof serverEnvSchema>;
export const serverEnv: IServerEnv =
  typeof window === 'undefined'
    ? serverEnvSchema.parse(Bun.env)
    : ({} as IServerEnv);
