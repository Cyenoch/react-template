import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { getThemeInitScript, seo } from "@/core/utils";
import { MainLayout } from "@/components/layouts/main-layout";
import { AppProviders } from "@/components/providers";
import appCss from "@/index.css?url";
import { publicEnv } from "@/core/env";
import { getInitialAppState } from "@/store";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, user-scalable=no",
      },
      ...seo({
        title: "React Template",
        description:
          "A polished TanStack Start starter with shadcn/ui, Zustand, and a production-ready homepage.",
      }),
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootDocument,
  async loader() {
    return {
      initialAppState: await getInitialAppState(),
    };
  },
});

function RootDocument() {
  const { initialAppState } = Route.useLoaderData();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: getThemeInitScript(initialAppState.theme),
          }}
        />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `;window.__INJECTED_PUBLIC_ENV__=${JSON.stringify(publicEnv)};`,
          }}
        />
      </head>

      <body className="min-h-svh bg-background text-foreground">
        <AppProviders initialState={initialAppState}>
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
