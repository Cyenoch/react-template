import type { NavigateOptions, ToOptions } from '@tanstack/react-router';
import React from 'react';
import { Toaster } from 'sonner';

declare module '@react-types/shared' {
  interface RouterConfig {
    href: ToOptions['to'];
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}

export function AppUIProvider({ children }: React.PropsWithChildren) {
  return (
    <>
      {children}
      <Toaster position="top-center" richColors />
    </>
  );
}
