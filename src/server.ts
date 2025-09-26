import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server';
import { getRootLogger } from './utils/server-utils';

getRootLogger().info('Server started');

const handler = createStartHandler((context) => {
  return defaultStreamHandler(context);
});

export default {
  async fetch(request: Request): Promise<Response> {
    return handler(request);
  },
};
