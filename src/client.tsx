import { StartClient } from '@tanstack/react-start';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createRouter } from './router';
import { initSentryClient } from './lib/observability/sentry';
import { initPerformanceMonitoring } from './lib/observability/performance';

const router = createRouter();

// Initialize monitoring with router for TanStack Start
initSentryClient(router);
initPerformanceMonitoring();

hydrateRoot(
  document,
  <StrictMode>
    <StartClient router={router} />
  </StrictMode>,
);
