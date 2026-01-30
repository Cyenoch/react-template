import { base } from "../context";
import { authMiddleware, requiredAuthMiddleware } from "../middleware/auth";

const me = base.use(requiredAuthMiddleware).handler(async ({ context }) => {
  return context.auth;
});

const maybeMe = base.use(authMiddleware).handler(async ({ context }) => {
  return context.auth;
});

export const orpcAuthRouter = {
  auth: {
    me,
    maybeMe,
  },
};
