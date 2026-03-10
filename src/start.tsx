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

/**
Request -> create Start (edge server only one instance)
  /
    page beforeLoad
      /api/session with Trace ID
    page SSR
    render
  /api/session
    with Trace ID (from request or generated if no present)
    other function with same Trace ID
  /_function
    with Trace ID (from request or generated if no present)
    other function with same Trace ID
*/
