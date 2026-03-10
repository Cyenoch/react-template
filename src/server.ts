import "./instrumentation";
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import { getLogger } from "./core/utils/logger";
import { traceFetch } from "./core/utils/trace";

// oxlint-disable-next-line no-unused-vars
const logger = getLogger(import.meta.file);

const handler = createStartHandler(defaultStreamHandler);

export default { fetch: traceFetch(handler) };
