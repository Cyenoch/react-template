import pino from "pino";
import { z } from "zod";

const apiEnvSchema = z.object({
  LOG_LEVEL: z.string().min(3).max(10).default("trace"),
  X_FORWARDED_FOR: z.string().optional(),
});

export type IApiEnv = z.output<typeof apiEnvSchema>;

if (typeof window === "undefined") {
  const parsed = apiEnvSchema.safeParse(typeof Bun !== "undefined" ? Bun.env : process.env);
  if (!parsed.success) {
    pino().error(z.treeifyError(parsed.error), "Invalid API environment variables");
  }
}

export const apiEnv: IApiEnv =
  typeof window === "undefined"
    ? apiEnvSchema.parse(typeof Bun !== "undefined" ? Bun.env : process.env)
    : ({} as IApiEnv);
