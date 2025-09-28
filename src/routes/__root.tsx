import type { QueryClient } from '@tanstack/react-query';
import { seo } from '@/utils/seo';
import appCss from '@/index.css?url';
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Session, User } from 'better-auth';
import { orpcClient } from '@/orpc/client';
import { AppProviders } from '@/components/providers';
import { ToastProvider } from '@heroui/react';

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

          <ToastProvider placement={'top-center'} toastOffset={60} />

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
