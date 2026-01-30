import type { DepOptimizationOptions } from "vite";

export const optimizeDeps: DepOptimizationOptions = {
  exclude: ["bun", "better-auth/react"],
  include: ["react", "react-dom", "react-dom/client"],
};
