import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server';
import * as Sentry from '@sentry/tanstackstart-react';
import { getRootLogger } from './lib/middleware/logger';

getRootLogger().info('Server started');

const handler = createStartHandler((context) => {
  return Sentry.wrapStreamHandlerWithSentry(defaultStreamHandler)(context);
});

export default {
  async fetch(request: Request): Promise<Response> {
    return handler(request);
  },
};
