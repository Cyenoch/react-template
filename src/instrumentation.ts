import process from 'node:process';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ORPCInstrumentation } from '@orpc/otel';
import { getRootLogger } from './lib/utils/server-utils';

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
