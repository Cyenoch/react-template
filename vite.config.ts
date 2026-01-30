import tailwindcss from "@tailwindcss/vite";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import autoImport from "unplugin-auto-import/vite";
import icons from "unplugin-icons/vite";
import { defineConfig, loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { autoImportOptions } from "./vite/auto-import-options";
import { environments } from "./vite/environments";
import { optimizeDeps } from "./vite/optimize-deps";

const envDir = "../..";

export default defineConfig(({ mode }) => {
  // Load env files from root and inject into process.env for server-side code
  const env = loadEnv(mode, envDir, "");
  Object.assign(process.env, env);

  return {
    envDir,
    plugins: [
      tsConfigPaths({ projects: ["./tsconfig.json"] }),

      icons({ compiler: "jsx", jsx: "react" }),

      tanstackStart({ router: { entry: "router.ts" } }),

      nitroV2Plugin({ preset: "bun" }),

      react(),

      autoImport(autoImportOptions),

      tailwindcss(),
    ],

    environments,
    optimizeDeps,
    build: {
      sourcemap: true,
    },
    experimental: {
      enableNativePlugin: true,
    },
  };
});
