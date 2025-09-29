import { getRootLogger } from './utils/server-utils';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ORPCInstrumentation } from '@orpc/otel';
import process from 'node:process';

const logger = getRootLogger().child({
  module: 'Instrumentation',
});

const sdk = new NodeSDK({
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-pg': {
        enhancedDatabaseReporting: true,
        addSqlCommenterCommentToQueries: true,
        requireParentSpan: true,
      },
    }),
    new ORPCInstrumentation(),
  ],
});

sdk.start();

process.on('SIGTERM', () => {
  sdk.shutdown();
});

process.on('SIGINT', () => {
  sdk.shutdown();
});

logger.info('Instrumentations registered');
