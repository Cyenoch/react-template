import process from 'node:process';
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server';
import { getRootLogger } from './lib/utils/server-utils';
import { traceFetch } from './lib/utils/trace';
import './instrumentation';

const logger = getRootLogger().child({
  module: 'ServerRoot',
});

const handler = createStartHandler(defaultStreamHandler);

export default { fetch: traceFetch(handler) };

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught Exception');
});

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled Rejection');
});

logger.info('Server started successfully');
