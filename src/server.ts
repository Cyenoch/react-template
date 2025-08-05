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

export default createStartHandler({
  createRouter,
})(defaultStreamHandler);

registerGlobalMiddleware({
  middleware: [
    requestIdMiddleware,
    loggerMiddleware,
    httpRequestLoggerMiddleware,
  ],
});
