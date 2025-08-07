import * as Sentry from '@sentry/tanstackstart-react';
import { clientEnv } from '@/lib/env';

export function initSentryClient(router: any) {
  if (!clientEnv.SENTRY_DSN) {
    console.warn('Sentry DSN not configured, skipping Sentry initialization');
    return;
  }

  Sentry.init({
    dsn: clientEnv.SENTRY_DSN,

    // Adds request headers and IP for users
    sendDefaultPii: true,

    integrations: [
      // Performance monitoring for TanStack Router
      Sentry.tanstackRouterBrowserTracingIntegration(router),
      // Session replay for debugging
      Sentry.replayIntegration(),
      // User feedback widget
      Sentry.feedbackIntegration({
        colorScheme: 'system',
      }),
    ],

    // Enable logs to be sent to Sentry
    enableLogs: true,

    // Performance Monitoring
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing
    // We recommend adjusting this value in production
    tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.1,

    // Session Replay
    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    environment: import.meta.env.MODE,

    beforeSend(event) {
      // Filter out development errors in console
      if (import.meta.env.DEV) {
        console.group('🚨 Sentry Event');
        console.error(event);
        console.groupEnd();
      }
      return event;
    },
  });
}

export function initSentryServer() {
  if (!process.env.SENTRY_DSN) {
    console.warn(
      'Sentry DSN not configured, skipping server Sentry initialization',
    );
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Adds request headers and IP for users
    sendDefaultPii: true,

    // Enable logs to be sent to Sentry
    enableLogs: true,

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing
    // We recommend adjusting this value in production
    tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,

    environment: process.env.NODE_ENV,
  });
}

export { Sentry };
