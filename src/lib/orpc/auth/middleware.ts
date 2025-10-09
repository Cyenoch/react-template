import { ORPCError, os } from '@orpc/server';
import type { Session, User } from 'better-auth';
import { auth } from '@/lib/auth/server';

export type AuthSession = Session;
export type AuthUser = User;
export type AuthContext = {
  auth?: { session: AuthSession; user: AuthUser };
};

export const authMiddleware = os
  .$context<{ headers: Headers }>()
  .middleware(async ({ next, context }) => {
    const result = await auth.api.getSession({ headers: context.headers });
    const session = result?.session;
    const user = result?.user;
    return await next({
      context: {
        auth: !session || !user ? undefined : { session, user },
      },
    });
  });

export const requiredAuthMiddleware = os
  .$context<AuthContext>()
  .middleware(async ({ next, context }) => {
    if (!context.auth) {
      throw new ORPCError('UNAUTHORIZED');
    }
    return await next({
      context: {
        auth: context.auth!,
      },
    });
  });

Object.defineProperty(authMiddleware, 'name', {
  value: 'auth',
});

Object.defineProperty(requiredAuthMiddleware, 'name', {
  value: 'requiredAuth',
});
