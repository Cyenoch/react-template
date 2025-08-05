import type { QueryClient } from '@tanstack/react-query';
import { seo } from '@/utils/seo';
import appCss from '@/styles/global.css?url';
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { getRequestId } from '@/lib/middleware/request-id';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
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
  async loader() {
    const requestId = await getRequestId();
    return {
      requestId,
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
  const { requestId } = Route.useLoaderData();

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>

      <body className="min-h-svh">
        {children}
        <Toaster richColors position="top-center" />
        <ReactQueryDevtools />
        <TanStackRouterDevtools />
        <footer className="text-center text-xs p-2">
          <pre>{requestId}</pre>
        </footer>
        <Scripts />
      </body>
    </html>
  );
}
