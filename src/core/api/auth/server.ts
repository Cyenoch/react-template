import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDrizzleInstance } from "@/core/database";

export const auth = betterAuth({
  database: drizzleAdapter(getDrizzleInstance(), {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },
});

export type Auth = typeof auth;
