import { orpcAuthRouter } from './auth';
import { loggerMiddleware } from './middleware/logger';
import { orpcBase } from './base';

export const orpcRootRouter = orpcBase.use(loggerMiddleware).router({
  ...orpcAuthRouter,
});
