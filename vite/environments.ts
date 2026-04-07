import type { EnvironmentOptions } from "vite-plus";
import { rolldownOptions } from "./advanced-chunks.ts";

/**
 * 环境配置（Vite 5.2+）
 * 为客户端/服务端分别配置构建选项
 */
export const environments: Record<string, EnvironmentOptions> = {
  client: {
    build: {
      target: "es2020", // 支持现代浏览器
      sourcemap: true,
      chunkSizeWarningLimit: 1024 * 1024, // 1MB 警告阈值
      rolldownOptions: rolldownOptions,
    },
  },
  server: {
    build: {
      sourcemap: true,
      target: "esnext",
    },
  },
};
