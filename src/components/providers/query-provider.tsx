import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@/utils/query-client';
import React from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

export function QueryProvider({ children, queryClient }: QueryProviderProps) {
  const [client] = React.useState(() => queryClient || createQueryClient());

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}
