import { createServerOnlyFn } from "@tanstack/react-start";
import { z } from "zod";

export const ServerEnvSchema = z.object({
  // Database
  DATABASE_URL: z.url(),

  // Better Auth
  BETTER_AUTH_SECRET: z.string().min(32).max(256),

  // Reverse Proxy
  X_FORWARDED_FOR: z.string().optional(),

  // OpenTelemetry
  OTEL_SERVICE_NAME: z.string().optional(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
  OTEL_EXPORTER_OTLP_INSECURE: z.string().optional(),

  LOG_LEVEL: z.string().min(3).max(10).default("trace"),
});

export type ServerEnv = z.output<typeof ServerEnvSchema>;

export const getServerEnv = createServerOnlyFn(() => {
  return ServerEnvSchema.parse(process.env);
});
