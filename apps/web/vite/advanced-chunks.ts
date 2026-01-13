import type { OutputOptions as RolldownOptions } from "rolldown";

export const advancedChunks: RolldownOptions["advancedChunks"] = {
  groups: [
    {
      test: /node_modules[\\/]react/,
      name: "react",
      priority: 20,
    },
    {
      test: /node_modules[\\/]react-dom/,
      name: "react-dom",
      priority: 20,
    },
    {
      test: /node_modules[\\/]@base-ui[\\/]react/,
      name: "base-ui",
      priority: 14,
    },
    {
      test: /node_modules[\\/]@tanstack[\\/]react-query/,
      name: "query",
      priority: 15,
    },
    {
      test: /node_modules[\\/]@tanstack[\\/]react-router/,
      name: "router",
      priority: 15,
    },
    {
      test: /node_modules[\\/]framer-motion/,
      name: "animation",
      priority: 10,
    },
    {
      test: /node_modules[\\/](zod|superjson)/,
      name: "validation",
      priority: 10,
    },
    {
      test: /node_modules[\\/](date-fns|uuid)/,
      name: "utils",
      priority: 5,
    },
  ],
};
