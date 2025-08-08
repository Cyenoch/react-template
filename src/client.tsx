import { StartClient } from '@tanstack/react-start';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createRouter } from './router';
import { initPerformanceMonitoring } from './lib/observability/performance';
import { initSentryIsomorphic } from './lib/observability/sentry';

const router = createRouter();

// Initialize monitoring with router for TanStack Start
initSentryIsomorphic(router);
initPerformanceMonitoring();

hydrateRoot(
  document,
  <StrictMode>
    <StartClient router={router} />
  </StrictMode>,
);
