import z from 'zod'

export const Env = z.object({
  LOG_LEVEL: z.string().min(3).max(10).default('trace'),
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32).max(256),
}).parse(Bun.env)
