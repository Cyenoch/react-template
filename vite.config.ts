import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import autoImport from "unplugin-auto-import/vite";
import icons from "unplugin-icons/vite";
import { defineConfig } from "vite-plus";
import { autoImportOptions } from "./vite/auto-import-options.ts";
import { environments } from "./vite/environments.ts";
import { optimizeDeps } from "./vite/optimize-deps.ts";

const __dirname = import.meta.dirname;

export default defineConfig({
  // 路径别名：使用 @ 代替 ./src
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // 插件配置（顺序很重要）
  plugins: [
    icons({ compiler: "jsx", jsx: "react" }), // Iconify 图标
    tanstackStart({
      // TanStack Start 文件路由
      router: { entry: "router.ts" },
      server: { entry: "server.ts" },
    }),
    nitroV2Plugin({ preset: "node-server" }), // Nitro 服务器适配器
    react(), // React Fast Refresh
    autoImport(autoImportOptions), // 自动导入 hooks/组件
    tailwindcss(), // Tailwind CSS（必须放最后）
  ],

  // 环境配置（详见 ./vite/environments.ts）
  environments,

  // 依赖优化（详见 ./vite/optimize-deps.ts）
  optimizeDeps,
});
