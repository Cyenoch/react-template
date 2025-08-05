import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server';
import { createRouter } from './router';
import { registerGlobalMiddleware } from '@tanstack/react-start';
import {
  httpRequestLoggerMiddleware,
  loggerMiddleware,
} from './server/middleware/logger';
import { requestIdMiddleware } from './server/middleware/request-id';

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
