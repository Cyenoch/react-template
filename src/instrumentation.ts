import process from "node:process";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getLogger } from "./core/utils/logger";

const logger = getLogger(import.meta.file);

const sdk = new NodeSDK({
  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-pg": {
        enhancedDatabaseReporting: true,
        addSqlCommenterCommentToQueries: true,
        requireParentSpan: true,
      },
    }),
  ],
});

sdk.start();

process.on("SIGTERM", () => {
  // oxlint-disable-next-line typescript/no-floating-promises
  sdk.shutdown();
});

process.on("SIGINT", () => {
  // oxlint-disable-next-line typescript/no-floating-promises
  sdk.shutdown();
});

logger.info("Instrumentations registered");
