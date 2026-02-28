import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { Session, User } from "better-auth";
import { cn, seo } from "@/core/utils";
import { orpcQueryClient } from "@/core/api/client";
import { MainLayout } from "@/components/layouts/main-layout";
import { AppProviders } from "@/components/providers";
import appCss from "@/index.css?url";
import { getTheme } from "@/core/utils";
import type { ClientEnv } from "@/core/env";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  user: User | undefined;
  session: Session | undefined;
  theme: string;
  clientEnv: ClientEnv;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, user-scalable=no",
      },
      ...seo({
        title: "[ReactTemplate]",
        description: "[ReactTemplate]",
      }),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootDocument,
  async beforeLoad({ context: { queryClient } }) {
    const session = await queryClient.ensureQueryData(orpcQueryClient.auth.maybeMe.queryOptions());
    const clientEnv = await queryClient.ensureQueryData(orpcQueryClient.clientEnv.queryOptions());
    return {
      session: session?.session,
      user: session?.user,
      theme: getTheme(),
      clientEnv,
    };
  },
});

function RootDocument() {
  const { theme, clientEnv } = Route.useRouteContext();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `;window.__INJECTED_PUBLIC_ENV__ = ${JSON.stringify(clientEnv)};`,
          }}
        ></script>
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
