import {
  init,
  replayIntegration,
  tanstackRouterBrowserTracingIntegration,
  sentryGlobalServerMiddlewareHandler,
  startSpan as sentryStartSpan,
  type BrowserOptions,
  type NodeOptions,
} from '@sentry/tanstackstart-react';
import {
  Options as SentryOptions,
  setTags,
  Span,
  StartSpanOptions,
} from '@sentry/core';
import { clientEnv, serverEnv } from '@/lib/env';
import { createIsomorphicFn, createMiddleware } from '@tanstack/react-start';
import { defu } from 'defu';
import {
  VITE_META_DEV,
  VITE_META_MODE,
  VITE_META_PROD,
  VITE_META_SSR,
} from '../constants';
import { getRootLogger } from '../middleware/logger';
import { requestIdMiddleware } from '../middleware/request-id';
import { authMiddleware } from '../auth';

export {
  captureException,
  withErrorBoundary,
} from '@sentry/tanstackstart-react';

const commonSentryInit = {
  sendDefaultPii: true,
  integrations: [],
  enableLogs: true,
  tracesSampleRate: VITE_META_DEV ? 1.0 : 0.3,
  profilesSampleRate: VITE_META_DEV ? 1.0 : 0.1,
  environment: VITE_META_MODE,

  // Release and distribution tracking
  release: `${serverEnv.APP_IDENTITY}@${serverEnv.APP_VERSION ?? 'unpublished'}`,
} satisfies SentryOptions | BrowserOptions | NodeOptions;

function _setTags() {
  setTags({
    'import.meta.env.DEV': VITE_META_DEV,
    'import.meta.env.PROD': VITE_META_PROD,
    'import.meta.env.MODE': VITE_META_MODE,
    'import.meta.env.SSR': VITE_META_SSR,
  });
}

export const initSentryIsomorphic = createIsomorphicFn()
  .server((_router: unknown) => {
    if (!serverEnv.VITE_SENTRY_DSN) {
      return getRootLogger().trace(
        'Sentry DSN not configured, skipping server Sentry initialization',
      );
    }

    init(
      defu(
        {
          dsn: serverEnv.VITE_SENTRY_DSN,
        },
        commonSentryInit,
      ),
    );

    _setTags();
  })
  .client((router: unknown) => {
    if (!clientEnv.VITE_SENTRY_DSN) {
      return console.trace(
        'Sentry DSN not configured, skipping Sentry initialization',
      );
    }

    init(
      defu(
        {
          dsn: clientEnv.VITE_SENTRY_DSN,
          integrations: [
            tanstackRouterBrowserTracingIntegration(router),
            replayIntegration(),
          ],
          replaysSessionSampleRate: VITE_META_DEV ? 1.0 : 0.1,
          replaysOnErrorSampleRate: 1.0,
          // Browser performance tracking
          trackComponents: true,
          trackInteractions: true,
        },
        commonSentryInit,
      ),
    );

    _setTags();
  });

export const sentryMiddleware = createMiddleware({ type: 'function' })
  .middleware([requestIdMiddleware])
  .server((options) => {
    return sentryGlobalServerMiddlewareHandler()(options);
  });

export const startSpan = <T>(
  options: StartSpanOptions,
  fn: (span: Span) => T,
) => {
  return sentryStartSpan(options, fn);
};

export const sentryTraceMiddleware = createMiddleware({
  type: 'function',
})
  .middleware([requestIdMiddleware, authMiddleware])
  .client(
    async ({ next, functionId, filename, method, context: { requestId } }) => {
      return await startSpan(
        {
          name: `Span During Request [${requestId}]`,
          op: functionId,
          attributes: {
            'tanstack.middleware.sentry-trace.filename': filename,
            'tanstack.middleware.sentry-trace.functionId': functionId,
            'tanstack.middleware.sentry-trace.method': method,
          },
        },
        () => next(),
      );
    },
  )
  .server(({ next }) => {
    return next();
  });
