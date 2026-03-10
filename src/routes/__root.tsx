import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { seo, cn, getTheme } from "@/core/utils";
import { MainLayout } from "@/components/layouts/main-layout";
import { AppProviders } from "@/components/providers";
import appCss from "@/index.css?url";
import { publicEnv } from "@/core/env";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  theme: string;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, user-scalable=no",
      },
      ...seo({
        title: "[ReactTemplate]",
        description: "[ReactTemplate]",
      }),
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootDocument,
  async beforeLoad() {
    return {
      theme: getTheme(),
    };
  },
});

function RootDocument() {
  const { theme } = Route.useRouteContext();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script suppressHydrationWarning dangerouslySetInnerHTML={{__html: `;window.__INJECTED_PUBLIC_ENV__=${JSON.stringify(publicEnv)};`}} />
      </head>

      <body className={cn("min-h-svh", theme)}>
        <AppProviders>
          {/* Content */}
          <MainLayout>
            <RootContent />
          </MainLayout>

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
