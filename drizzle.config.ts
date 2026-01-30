import { defineConfig } from "drizzle-kit";

const getEnv = () => (typeof Bun !== "undefined" ? Bun.env : process.env);

export default defineConfig({
  schema: "./src/core/database/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: getEnv().DATABASE_URL!,
  },
});
