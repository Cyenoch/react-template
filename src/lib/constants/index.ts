// App constants
export const APP_NAME = 'React Template';
export const APP_DESCRIPTION = 'Modern React template with TypeScript, TanStack Router, and more';

// API constants
export const API_BASE_URL = '/api';

// Auth constants
export const AUTH_ROUTES = {
  SIGN_IN: '/',
  SIGN_UP: '/signup',
  CALLBACK: '/user',
  SIGN_OUT: '/signout',
} as const;

// Route constants
export const ROUTES = {
  HOME: '/',
  USER: '/user',
} as const;

// Query keys
export const QUERY_KEYS = {
  AUTH: {
    SESSION: ['auth', 'session'],
    USER: ['auth', 'user'],
  },
  USER: {
    PROFILE: ['user', 'profile'],
    SETTINGS: ['user', 'settings'],
  },
} as const;

// Cache settings
export const CACHE_SETTINGS = {
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  DEFAULT_CACHE_TIME: 10 * 60 * 1000, // 10 minutes
} as const;

// Validation constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_MAX_LENGTH: 254,
  NAME_MAX_LENGTH: 100,
} as const;
