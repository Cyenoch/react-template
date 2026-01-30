import type { EnvironmentOptions } from "vite";
import { advancedChunks } from "./advanced-chunks";

/**
 * 环境配置（Vite 5.2+）
 * 为客户端/服务端分别配置构建选项
 */
export const environments: Record<string, EnvironmentOptions> = {
  client: {
    build: {
      target: "es2020", // 支持现代浏览器
      chunkSizeWarningLimit: 1024 * 1024, // 1MB 警告阈值
      rolldownOptions: {
        output: {
          advancedChunks, // 代码分割策略（详见 ./advanced-chunks.ts）
        },
      },
    },
  },
};
