import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import autoImport from "unplugin-auto-import/vite";
import icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { autoImportOptions } from "./vite/auto-import-options";
import { environments } from "./vite/environments";
import { optimizeDeps } from "./vite/optimize-deps";

export default defineConfig(() => {
  return {
    // 路径别名：使用 @ 代替 ./src
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    // 插件配置（顺序很重要）
    plugins: [
      tsConfigPaths({ projects: ["./tsconfig.json"] }), // TypeScript 路径映射
      icons({ compiler: "jsx", jsx: "react" }), // Iconify 图标
      tanstackStart({
        // TanStack Start 文件路由
        router: { entry: "router.ts" },
        server: { entry: "server.ts" },
      }),
      nitroV2Plugin({ preset: "bun" }), // Nitro 服务器适配器
      react(), // React Fast Refresh
      autoImport(autoImportOptions), // 自动导入 hooks/组件
      tailwindcss(), // Tailwind CSS（必须放最后）
    ],

    // 环境配置（详见 ./vite/environments.ts）
    environments,

    // 依赖优化（详见 ./vite/optimize-deps.ts）
    optimizeDeps,

    // SSR 配置
    ssr: {
      // better-auth: 避免 getSession 重复声明
      // 参考：https://github.com/better-auth/better-auth/issues/7493
      external: ["better-auth"],
    },

    // 构建配置
    build: {
      sourcemap: true, // 生成 source map
      target: "es2020",
      cssCodeSplit: true,
      minify: "esbuild",
      chunkSizeWarningLimit: 1024, // 1MB
    },

    // 实验性功能
    experimental: {
      enableNativePlugin: true, // Rolldown（Rust 打包器，比 Rollup 快 5-10x）
    },
  };
});
