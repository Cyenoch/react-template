// Validation constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_MAX_LENGTH: 254,
  NAME_MAX_LENGTH: 100,
} as const;

export const VITE_META_DEV = import.meta.env.DEV;
export const VITE_META_PROD = import.meta.env.PROD;
export const VITE_META_MODE = import.meta.env.MODE;
export const VITE_META_SSR = import.meta.env.SSR;