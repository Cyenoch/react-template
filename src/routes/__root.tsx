import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Session, User } from 'better-auth';
import { AppProviders } from '@/components/providers';
import appCss from '@/index.css?url';
import { orpcClient } from '@/lib/orpc/client';
import { seo } from '@/lib/utils/seo';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
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
  component: RootDocument,
  async beforeLoad() {
    const session = await orpcClient.auth.maybeMe();
    return {
      session: session?.session,
      user: session?.user,
    };
  },
});

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>

      <body className="min-h-svh">
        <AppProviders>
          {/* Content */}
          <RootContent />

          {/* Devtools */}
          <ReactQueryDevtools />
          <TanStackRouterDevtools />
        </AppProviders>

        {/* Scripts */}
        <Scripts />
      </body>
    </html>
  );
}

function RootContent() {
  return <Outlet />;
}
