import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Session, User } from "better-auth";
import { cn, seo } from "@workspace/shared";
import { orpcClient } from "@workspace/api/client";
import { MainLayout } from "@/components/layouts/main-layout";
import { AppProviders } from "@/components/providers";
import appCss from "@/index.css?url";
import { getTheme } from "@/lib/utils/theme";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  user: User | undefined;
  session: Session | undefined;
  theme: string;
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
  async beforeLoad() {
    const session = await orpcClient.auth.maybeMe();
    return {
      session: session?.session,
      user: session?.user,
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
