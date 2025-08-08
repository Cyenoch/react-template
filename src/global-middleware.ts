import { registerGlobalMiddleware } from '@tanstack/react-start';
import { requestIdMiddleware } from './lib/middleware/request-id';
import {
  httpRequestLoggerMiddleware,
  loggerMiddleware,
} from './lib/middleware/logger';
import { sentryMiddleware } from './lib/observability/sentry';

registerGlobalMiddleware({
  middleware: [
    requestIdMiddleware,
    loggerMiddleware,
    sentryMiddleware,
    httpRequestLoggerMiddleware,
  ],
});
