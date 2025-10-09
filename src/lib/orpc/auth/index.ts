import { orpcBase } from '../base';
import { authMiddleware, requiredAuthMiddleware } from './middleware';

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
