import { ThemeProvider } from './dark-theme'

export const AppProviders: FC = ({ children }) => {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="theme"
    >
      {children}
    </ThemeProvider>
  )
}
