import { createIsomorphicFn, createStart } from "@tanstack/react-start";
import { getServerEnv, publicEnv } from "./core/env";
import { getLogger } from "./core/utils/logger";

export const startInstance = createStart(() => {
  return {};
});

createIsomorphicFn()
  .client(() => {
    console.info("Tanstack Start", publicEnv);
  })
  .server(() => {
    const logger = getLogger(import.meta.file);
    logger.info(getServerEnv(), "Tanstack Start");
  })();
