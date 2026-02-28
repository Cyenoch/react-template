import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import { traceFetch } from "./core/utils/trace";
import "./instrumentation";
import { getLogger } from "./core/utils";
import { getServerEnv } from "./core/env";

const logger = getLogger("ServerRoot");

const handler = createStartHandler(defaultStreamHandler);

export default { fetch: traceFetch(handler) };

logger.info(
  {
    env: getServerEnv(),
  },
  "Server started successfully",
);
