import type { DepOptimizationOptions } from "vite";

export const optimizeDeps: DepOptimizationOptions = {
  exclude: ["bun", "@hookform/resolvers/zod", "better-auth/react"],
  include: ["react", "react-dom", "react-dom/client", "clsx", "tailwind-merge"],
};
