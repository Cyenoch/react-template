import React from 'react';
import { QueryProvider } from './query-provider';
import { AppHeroUIProvider } from './heroui-provider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AppHeroUIProvider>{children}</AppHeroUIProvider>
    </QueryProvider>
  );
}
