import { createMiddleware } from '@tanstack/react-start';
import { createIsomorphicFn } from '@tanstack/react-start';
import { authClient } from '../auth/client';
import { auth } from '../auth/server';
import { getHeaders } from '@tanstack/react-start/server';
import { setUser } from '@sentry/tanstackstart-react';

export const getSessionIsomorphic = createIsomorphicFn()
  .server(async () => {
    const session = await auth.api.getSession({
      headers: new Headers(getHeaders() as HeadersInit),
    });
    if (session) {
      setUser(session.user);
    }
    return session;
  })
  .client(async () => {
    const session = await authClient.getSession({});
    if (session.error) {
      throw new Error(session.error.message, {
        cause: session.error,
      });
    }
    if (session.data) {
      setUser(session.data.user);
    }
    return session.data;
  });

export const authMiddleware = createMiddleware({
  type: 'function',
}).server(async ({ next }) => {
  const session = await getSessionIsomorphic();
  return next({
    context: {
      session: session?.session,
      user: session?.user,
    },
  });
});

export const requireAuthMiddleware = createMiddleware({
  type: 'function',
})
  .middleware([authMiddleware])
  .server(async ({ next, context: { session, user } }) => {
    if (!session || !user) {
      throw new Error('Unauthorized');
    }
    return next({
      context: {
        session: session!,
        user: user!,
      },
    });
  });
