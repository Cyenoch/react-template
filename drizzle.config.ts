import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/server/database/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: Bun.env.DATABASE_URL!,
  },
})
