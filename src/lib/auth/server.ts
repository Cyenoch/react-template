import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDrizzleInstance } from '../database';

// Cache auth instance to prevent recreation on every HMR
let cachedAuth: ReturnType<typeof betterAuth> | null = null;

export const auth = (() => {
  if (cachedAuth) {
    return cachedAuth;
  }
  
  cachedAuth = betterAuth({
    database: drizzleAdapter(getDrizzleInstance(), {
      provider: 'pg',
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      requireEmailVerification: false,
    },
  });
  
  return cachedAuth;
})();

// HMR handling for auth module
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    // Clear the cached auth instance on HMR
    cachedAuth = null;
  });
  
  import.meta.hot.accept(() => {
    // Accept HMR updates
    console.log('Auth module accepted HMR update');
  });
}
