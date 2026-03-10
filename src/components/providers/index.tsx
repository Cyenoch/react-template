import React from "react";
import { QueryProvider } from "./query-provider";
import { AppUIProvider } from "./ui-provider";
import { AppStoreProvider, type AppStoreSnapshot } from "@/store";

interface AppProvidersProps {
  children: React.ReactNode;
  initialState: AppStoreSnapshot;
}

export function AppProviders({ children, initialState }: AppProvidersProps) {
  return (
    <AppStoreProvider initialState={initialState}>
      <QueryProvider>
        <AppUIProvider>{children}</AppUIProvider>
      </QueryProvider>
    </AppStoreProvider>
  );
}
