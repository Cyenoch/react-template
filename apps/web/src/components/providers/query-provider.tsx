import { QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import React from "react";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const router = useRouter();

  return (
    <QueryClientProvider client={router.options.context.queryClient}>
      {children}
    </QueryClientProvider>
  );
}
