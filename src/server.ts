import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server';
import { getRootLogger } from './utils/server-utils';

const logger = getRootLogger().child({
  module: 'ServerRoot',
});

logger.info('Server starting...');

import './instrumentation';

const handler = createStartHandler((context) => {
  return defaultStreamHandler(context);
});

export default {
  async fetch(request: Request): Promise<Response> {
    return handler(request);
  },
};

logger.info('Server started successfully');
