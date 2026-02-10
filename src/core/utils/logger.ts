import pino, { type Logger } from "pino";
import { serverEnv } from "@/core/env";
import { isDev } from "./env-helper";

const prettyTransport = {
  target: "pino-pretty",
  options: {
    colorize: true,
  },
};

export const rootLogger = pino({
  level: serverEnv.LOG_LEVEL ?? "trace",
  transport: isDev ? prettyTransport : undefined,
});

/**
 * 创建带模块标识的子日志器
 * @param module 模块名称
 * @param bindings 附加绑定字段
 */
export function getLogger(
  module: string,
  bindings?: Record<string, unknown>,
): Logger {
  return rootLogger.child({ module, ...bindings });
}

export type { Logger };
