import { base } from "../context";
import { authMiddleware, requiredAuthMiddleware } from "../middleware/auth";

const me = base.auth.me
  .use(authMiddleware)
  .use(requiredAuthMiddleware)
  .handler(async ({ context }) => {
    return context.auth;
  });

const maybeMe = base.auth.maybeMe
  .use(authMiddleware)
  .handler(async ({ context }) => {
    return context.auth ?? null;
  });

export const authRouter = {
  me,
  maybeMe,
};
