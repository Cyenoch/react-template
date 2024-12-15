import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { AppProviders } from './components/provider'
import { routeTree } from './routeTree.gen'

import './globals.scss'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'

// Document: https://tanstack.com/router/latest/docs/framework/react/guide/route-trees
export const router = createRouter({
  routeTree,
  context: {
    miniAppRaw: undefined!, // We'll set this in React-land
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </StrictMode>,
  )
}

// eslint-disable-next-line react-refresh/only-export-components
function AppRouter() {
  return (
    <RouterProvider
      router={router}
      context={{
      }}
    />
  )
}
