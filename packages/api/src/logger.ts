import pino, { type Logger } from "pino";
import { apiEnv } from "./env";

const getEnv = () => (typeof Bun !== "undefined" ? Bun.env : process.env);
const isDev = getEnv().NODE_ENV !== "production";

export const rootLogger = pino({
  level: apiEnv.LOG_LEVEL ?? "trace",
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      }
    : undefined,
});

/**
 * 创建带模块标识的子日志器
 * @param module 模块名称
 * @param bindings 附加绑定字段
 */
export function getLogger(module: string, bindings?: Record<string, unknown>): Logger {
  return rootLogger.child({ module, ...bindings });
}

export type { Logger };
