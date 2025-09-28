import { HeroUIProvider } from '@heroui/react';
import type { NavigateOptions, ToOptions } from '@tanstack/react-router';
import React from 'react';

interface HeroUIProviderProps {
  children: React.ReactNode;
}

declare module '@react-types/shared' {
  interface RouterConfig {
    href: ToOptions['to'];
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}

export function AppHeroUIProvider({ children }: HeroUIProviderProps) {
  const router = useRouter();
  return (
    <HeroUIProvider
      navigate={(to, options) => router.navigate({ to, ...options })}
      useHref={(to) => router.buildLocation({ to }).href}
    >
      {children}
    </HeroUIProvider>
  );
}
