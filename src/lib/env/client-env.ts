import { z } from 'zod';

const clientEnvSchema = z.object({
  VITE_APP_IDENTITY: z.string(),
  VITE_APP_VERSION: z.string().optional(),

  VITE_SENTRY_DSN: z.url().optional(),
});

export type IClientEnv = z.output<typeof clientEnvSchema>;
export const clientEnv: IClientEnv =
  typeof window === 'undefined'
    ? ({} as IClientEnv)
    : (clientEnvSchema.parse(import.meta.env) as IClientEnv);
