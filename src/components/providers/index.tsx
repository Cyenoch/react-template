import React from 'react';
import { QueryProvider } from './query-provider';
import { AppUIProvider } from './ui-provider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AppUIProvider>{children}</AppUIProvider>
    </QueryProvider>
  );
}
