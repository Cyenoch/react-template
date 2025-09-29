import { getRootLogger } from './utils/server-utils';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ORPCInstrumentation } from '@orpc/otel';

const logger = getRootLogger().child({
  module: 'Instrumentation',
});

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations(), new ORPCInstrumentation()],
});

sdk.start();

logger.info('Instrumentations registered');
