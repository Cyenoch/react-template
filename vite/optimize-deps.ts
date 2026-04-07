import type { DepOptimizationOptions } from "vite";

/**
 * 依赖优化配置
 * 预打包依赖以提升开发服务器启动速度
 */
export const optimizeDeps: DepOptimizationOptions = {
  // 排除预打包（已经是 ESM 或 Node.js 原生模块）
  exclude: [],

  // 强制预打包（减少模块数量，提升加载速度）
  include: ["react", "react-dom", "react-dom/client"],
};
