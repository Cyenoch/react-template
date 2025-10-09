import { authMiddleware, requiredAuthMiddleware } from './middleware';
import { orpcBase } from '../base';

const me = orpcBase.use(requiredAuthMiddleware).handler(async ({ context }) => {
  return context.auth;
});

const maybeMe = orpcBase.use(authMiddleware).handler(async ({ context }) => {
  return context.auth;
});

export const orpcAuthRouter = {
  auth: {
    me,
    maybeMe,
  },
};
