import { z } from 'zod';

const clientEnvSchema = z.object({
  VITE_SENTRY_DSN: z.string().optional(),
});

export type IClientEnv = z.output<typeof clientEnvSchema>;
export const clientEnv: IClientEnv =
  typeof window === 'undefined'
    ? ({} as IClientEnv)
    : (clientEnvSchema.parse(import.meta.env) as IClientEnv);
