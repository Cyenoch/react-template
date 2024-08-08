import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'

import './globals.scss'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import { AppProviders } from './components/provider'
import { router } from './router'

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
