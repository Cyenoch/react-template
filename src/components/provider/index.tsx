import { Env } from '@/lib/global'
import { PrivyProvider } from '@privy-io/react-auth'
import { ThemeProvider } from './dark-theme'
import { AppQueryClientProvider } from './react-query'

export const AppProviders: FC = ({ children }) => {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="theme"
    >
      <AppQueryClientProvider>
        <PrivyProvider
          appId={Env.privyAppId}
        >
          {children}
        </PrivyProvider>
      </AppQueryClientProvider>
    </ThemeProvider>
  )
}
