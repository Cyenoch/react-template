import { authMiddleware } from './auth';
import { cacheMiddleware } from './cache';
import { databaseMiddleware } from './database';
import { httpRequestLoggerMiddleware, loggerMiddleware } from './logger';
import { requestIdMiddleware } from './request-id';

export const appMiddlewares = [
  requestIdMiddleware,
  loggerMiddleware,
  httpRequestLoggerMiddleware,
  cacheMiddleware,
  databaseMiddleware,
  authMiddleware,
] as const;
