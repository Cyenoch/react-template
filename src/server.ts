import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server';
import { createRouter } from './router';
import { registerGlobalMiddleware } from '@tanstack/react-start';
import {
  httpRequestLoggerMiddleware,
  loggerMiddleware,
} from './lib/middleware/logger';
import { requestIdMiddleware } from './lib/middleware/request-id';
import { initSentryServer, Sentry } from './lib/observability/sentry';
// Import global middleware to register Sentry middleware
import './global-middleware';

// Initialize Sentry on the server
initSentryServer();

export default createStartHandler({
  createRouter,
})(Sentry.wrapStreamHandlerWithSentry(defaultStreamHandler));

registerGlobalMiddleware({
  middleware: [
    requestIdMiddleware,
    loggerMiddleware,
    httpRequestLoggerMiddleware,
  ],
});
