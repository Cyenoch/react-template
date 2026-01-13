import { trace } from "@opentelemetry/api";
import { os } from "@orpc/server";
import { createServerOnlyFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestHeaders, getRequestIP } from "@tanstack/react-start/server";
import { apiEnv } from "../env";
import { rootLogger } from "../logger";

export const getClientIP = createServerOnlyFn(() => {
  const xForwardedFor = apiEnv.X_FORWARDED_FOR;
  const clientIP =
    !!xForwardedFor || xForwardedFor === "X-Forwarded-For"
      ? getRequestIP({ xForwardedFor: true })
      : xForwardedFor
        ? getRequestHeader(xForwardedFor)
        : getRequestIP();
  return clientIP;
});

export const appContextMiddleware = os
  .$context<{
    headers?: Headers;
  }>()
  .middleware(async ({ next, context, path }) => {
    const headers = context.headers ?? new Headers(getRequestHeaders());
    const clientIP = getClientIP() ?? "";
    const activeSpan = trace.getActiveSpan()!;
    const logger = rootLogger.child({
      module: `ORPC ${path.join("/")}`,
      path,
    });

    activeSpan?.updateName(`middleware.appContext ${path.join("/")}`);

    return await next({
      context: {
        headers: headers,
        clientIP: clientIP,
        logger: logger,
        activeSpan: activeSpan,
      },
    });
  });
