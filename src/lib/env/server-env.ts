import pino from "pino";
import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.url(),

  LOG_LEVEL: z.string().min(3).max(10).default("trace"),

  // Better Auth
  BETTER_AUTH_SECRET: z.string().min(32).max(256),
  BETTER_AUTH_URL: z.url(),

  // Proxy
  X_FORWARDED_FOR: z.string().optional(),

  // OpenTelemetry
  OTEL_SERVICE_NAME: z.string().optional(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
  OTEL_EXPORTER_OTLP_INSECURE: z.string().optional(),
});

export type IServerEnv = z.output<typeof serverEnvSchema>;

if (typeof window === "undefined" && typeof Bun !== "undefined") {
  const parsed = serverEnvSchema.safeParse(Bun.env);
  if (!parsed.success) {
    pino().error(z.treeifyError(parsed.error), "Invalid environment variables");
  }
}

export const serverEnv: IServerEnv =
  typeof window === "undefined" && typeof Bun !== "undefined" ? serverEnvSchema.parse(Bun.env) : ({} as IServerEnv);
