import { z } from 'zod';

const serverEnvSchema = z.object({
  DATABASE_URL: z.url(),

  LOG_LEVEL: z.string().min(3).max(10).default('trace'),

  BETTER_AUTH_SECRET: z.string().min(32).max(256),
  BETTER_AUTH_URL: z.url(),

  X_FORWARDED_FOR: z.string().optional(),
});

export type IServerEnv = z.output<typeof serverEnvSchema>;
export const serverEnv: IServerEnv =
  typeof window === 'undefined'
    ? serverEnvSchema.parse(Bun.env)
    : ({} as IServerEnv);
