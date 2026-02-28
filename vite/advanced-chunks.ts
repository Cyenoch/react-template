import type { Rolldown } from "vite";

/**
 * 代码分割策略
 * 将第三方库按优先级分组，优化缓存策略
 *
 * 优先级原则：
 * - 20: 框架核心（React）- 几乎不变，优先缓存
 * - 15: 业务库（Router、Query）- 中等变化频率
 * - 10: 数据校验（Zod）
 * - 8: 数据库（Drizzle ORM）
 * - 5: 工具库 - 体积小，可合并
 * - 3: 图标库 - 按需加载
 */
export const rolldownOptions: Rolldown.RolldownOptions = {
  output: {
    advancedChunks: {
      groups: [
        // React 核心
        { test: /node_modules[\\/]react[\\/]/, name: "react", priority: 20 },
        { test: /node_modules[\\/]react-dom[\\/]/, name: "react", priority: 20 },

        // TanStack 生态
        {
          test: /node_modules[\\/]@tanstack[\\/]react-router/,
          name: "router",
          priority: 15,
        },
        {
          test: /node_modules[\\/]@tanstack[\\/]react-query/,
          name: "query",
          priority: 15,
        },

        // UI 组件库
        {
          test: /node_modules[\\/]@base-ui[\\/]react/,
          name: "base-ui",
          priority: 14,
        },

        // 数据校验
        { test: /node_modules[\\/]zod/, name: "validation", priority: 10 },

        // 数据库相关
        {
          test: /node_modules[\\/](drizzle-orm|kysely-adapter|bun-sqlite-dialect|node-sqlite-dialect|memory-adapter)/,
          name: "database",
          priority: 8,
        },

        // 工具库
        {
          test: /node_modules[\\/](date-fns|uuid|clsx|class-variance-authority)/,
          name: "utils",
          priority: 5,
        },

        // 图标库
        {
          test: /node_modules[\\/](@iconify|@hugeicons)/,
          name: "icons",
          priority: 3,
        },
      ],
    },
  },
};
