import type { QueryClient } from '@tanstack/react-query';
import { seo } from '@/utils/seo';
import appCss from '@/styles/global.css?url';
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  ScriptOnce,
  Scripts,
} from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { wrapCreateRootRouteWithSentry } from '@sentry/tanstackstart-react';
import { getRequestId } from '@/lib/middleware/request-id';
import { getSessionIsomorphic } from '@/lib/auth';
import { Session, User } from 'better-auth';

declare global {
  interface Window {
    __RequestId: string;
  }
}

// Wrap createRootRouteWithContext with Sentry for SSR tracing
export const Route = wrapCreateRootRouteWithSentry(createRootRouteWithContext)<{
  queryClient: QueryClient;
  requestId: string;
  user: User | undefined;
  session: Session | undefined;
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, user-scalable=no',
      },
      ...seo({
        title: '[ReactTemplate]',
        description: '[ReactTemplate]',
      }),
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  async beforeLoad() {
    const requestId = getRequestId();
    const session = await getSessionIsomorphic();
    return {
      requestId,
      session: session?.session,
      user: session?.user,
    };
  },
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { requestId } = Route.useRouteContext();

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>

      <body className="min-h-svh">
        {/* Content */}
        <>
          {children}
          <footer className="text-center text-xs p-2">
            <pre>{requestId}</pre>
          </footer>
        </>

        {/* Devtools */}
        <Toaster richColors position="top-center" />
        <ReactQueryDevtools />
        <TanStackRouterDevtools />

        {/* Scripts */}
        <Scripts />
        <ScriptOnce>{`window.__RequestId = '${requestId}';`}</ScriptOnce>
      </body>
    </html>
  );
}
