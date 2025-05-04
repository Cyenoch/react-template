import type { QueryClient } from '@tanstack/react-query'
import { seo } from '@/lib/utils/seo'

import appCss from '@/styles/global.css?url'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
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
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>

      <body className="min-h-dvh">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
