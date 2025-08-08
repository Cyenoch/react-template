import {
  init,
  replayIntegration,
  tanstackRouterBrowserTracingIntegration,
  sentryGlobalServerMiddlewareHandler,
  startSpan,
  type BrowserOptions,
  type NodeOptions,
} from '@sentry/tanstackstart-react';
import {
  captureException,
  Options as SentryOptions,
  setTags,
  SPAN_STATUS_ERROR,
  continueTrace,
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
import { getTraceId, requestIdMiddleware } from '../middleware/request-id';
import { authMiddleware } from '../auth';
import { getRequestHeaders } from '@tanstack/react-start/server';

export {
  captureException,
  withErrorBoundary,
} from '@sentry/tanstackstart-react';

const appIdentity =
  typeof window === 'undefined'
    ? serverEnv.VITE_APP_IDENTITY
    : clientEnv.VITE_APP_IDENTITY;
const appVersion =
  typeof window === 'undefined'
    ? serverEnv.VITE_APP_VERSION
    : clientEnv.VITE_APP_VERSION;

const commonSentryInit = {
  sendDefaultPii: true,
  integrations: [],
  enableLogs: true,
  tracesSampleRate: VITE_META_DEV ? 1.0 : 0.3,
  profilesSampleRate: VITE_META_DEV ? 1.0 : 0.1,
  environment: VITE_META_MODE,

  // Release and distribution tracking
  release: `${appIdentity}@${appVersion ?? 'unpublished'}`,
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
          tracePropagationTargets: [window.location.origin],
          beforeSendSpan(span) {
            span.data = defu(
              {
                'x.trace-id': getTraceId(),
              },
              span.data,
            );
            return span;
          },
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

export const sentryTraceMiddleware = createMiddleware({
  type: 'function',
})
  // 确保 Auth Middleware 调用了 setUser (如果已经登录)
  .middleware([authMiddleware])
  .client(async ({ next, functionId, filename, method }) => {
    return await startSpan(
      {
        name: `Server Funcation Call [${functionId}]`,
        op: `server.function.${functionId}.call`,
        attributes: {
          'x.middleware.sentry-trace.filename': filename,
          'x.middleware.sentry-trace.functionId': functionId,
          'x.middleware.sentry-trace.method': method,
        },
      },
      async (span) => {
        try {
          return await next();
        } catch (error) {
          span.recordException(error);
          span.setStatus({
            code: SPAN_STATUS_ERROR,
            message:
              typeof error === 'object' &&
              error !== null &&
              'message' in error &&
              typeof error.message === 'string'
                ? error.message
                : `${error}`,
          });
          captureException(error);
          throw error;
        } finally {
          span.end();
        }
      },
    );
  })
  .server(async ({ next, functionId, filename, method }) => {
    const headers = getRequestHeaders();
    const sentryTrace = headers['sentry-trace'];
    const baggage = headers['baggage'];
    return continueTrace(
      {
        sentryTrace,
        baggage,
      },
      () =>
        startSpan(
          {
            name: `Server Funcation Execution [${functionId}]`,
            op: `server.function.${functionId}.execution`,
            attributes: {
              'x.middleware.sentry-trace.filename': filename,
              'x.middleware.sentry-trace.functionId': functionId,
              'x.middleware.sentry-trace.method': method,
            },
          },
          async (span) => {
            try {
              return await next();
            } catch (error) {
              span.recordException(error);
              span.setStatus({
                code: SPAN_STATUS_ERROR,
                message:
                  typeof error === 'object' &&
                  error !== null &&
                  'message' in error &&
                  typeof error.message === 'string'
                    ? error.message
                    : `${error}`,
              });
              captureException(error);
              throw error;
            } finally {
              span.end();
            }
          },
        ),
    );
  });
