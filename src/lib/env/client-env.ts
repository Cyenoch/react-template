import { z } from 'zod';

const clientEnvSchema = z.object({
  SENTRY_DSN: z.string().url().optional(),
});

export type IClientEnv = z.output<typeof clientEnvSchema>;
export const clientEnv: IClientEnv =
  typeof window === 'undefined'
    ? ({} as IClientEnv)
    : (clientEnvSchema.parse(import.meta.env) as IClientEnv);
