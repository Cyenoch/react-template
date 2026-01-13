import { defineConfig } from "drizzle-kit";

const getEnv = () => (typeof Bun !== "undefined" ? Bun.env : process.env);

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: getEnv().DATABASE_URL!,
  },
});
