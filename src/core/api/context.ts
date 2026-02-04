import { implement } from "@orpc/server";
import { type Logger } from "@/core/utils";
import { appContextMiddleware } from "./middleware/app-context";
import type { Span } from "@opentelemetry/api";
import { contract } from "./contracts";

// Input context - only headers are provided by the RPC handler
export type InputContext = {
  clientIP: string;
  logger: Logger;
  headers: Headers;
  activeSpan: Span;
};

// Full server context - populated by middleware
export type ServerContext = InputContext & {};

// Create implementer from contract with context type
export const os = implement(contract).$context<ServerContext>();

export const base = os.use(appContextMiddleware);
