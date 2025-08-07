// Common utility types
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type NonEmptyArray<T> = [T, ...T[]];

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// API types
export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

// Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: Date;
}

// Form types
export interface SignInForm {
  email: string;
  password: string;
}

export interface SignUpForm {
  email: string;
  password: string;
  name: string;
}

// Server function types
export interface ServerFunctionContext {
  request: Request;
  userId?: string;
  sessionId?: string;
}

export interface ServerFunctionResult<T = unknown> {
  data?: T;
  error?: string;
  redirect?: string;
}

// Database types
export interface DatabaseConnection {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

// Logging types
export interface LogContext {
  requestId: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ip?: string;
}

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
