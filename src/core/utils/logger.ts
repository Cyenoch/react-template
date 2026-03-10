import pino, { type Logger } from "pino";
import { getServerEnv } from "../env/server-env";
import { createServerOnlyFn } from "@tanstack/react-start";

let rootLogger: Logger = undefined!;

/**
 * 创建带模块标识的子日志器
 * @param module 模块名称
 * @param bindings 附加绑定字段
 */
export const getLogger = createServerOnlyFn((module: string, bindings?: Record<string, unknown>): Logger => {
  if (!rootLogger) {
    rootLogger = pino({
      level: getServerEnv().LOG_LEVEL ?? "trace",
    });
  }
  return rootLogger.child({ module, ...bindings });
});

export type { Logger };
