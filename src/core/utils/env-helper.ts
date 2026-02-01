/**
 * Get environment object based on runtime
 */
export const getEnv = () => (typeof Bun !== "undefined" ? Bun.env : process.env);

/**
 * Check if running in development mode
 */
export const isDev = getEnv().NODE_ENV !== "production";
