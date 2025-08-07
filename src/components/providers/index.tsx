import React from 'react';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';
import { ErrorBoundary } from '@/components/core/error-boundary';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryProvider>
          {children}
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
