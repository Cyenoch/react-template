import { orpcAuthRouter } from './auth';
import { orpcBase } from './base';

export const orpcRootRouter = orpcBase.router({
  ...orpcAuthRouter,
});
