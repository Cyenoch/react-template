import { ThemeProvider } from './dark-theme'
import { AppQueryClientProvider } from './react-query'

export const AppProviders: FC = ({ children }) => {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="theme"
    >
      <AppQueryClientProvider>
        {children}
      </AppQueryClientProvider>
    </ThemeProvider>
  )
}
