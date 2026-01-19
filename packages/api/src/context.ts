import { os } from "@orpc/server";
import { type Logger } from "./logger";
import { appContextMiddleware } from "./middleware/app-context";
import type { Span } from "@opentelemetry/api";

// Input context - only headers are provided by the RPC handler
export type InputContext = {
  clientIP: string;
  logger: Logger;
  headers: Headers;
  activeSpan: Span;
};

// Full server context - populated by middleware
export type ServerContext = InputContext & {
  
};

// Base builder for creating middlewares that expect ServerContext
export const baseBuilder = os.$context<ServerContext>();

export const base = baseBuilder.use(appContextMiddleware);
