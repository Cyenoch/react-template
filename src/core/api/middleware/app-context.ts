import { getServerEnv } from "@/core/env";
import { getLogger } from "@/core/utils";
import { trace } from "@opentelemetry/api";
import { os } from "@orpc/server";
import { createServerOnlyFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestHeaders, getRequestIP } from "@tanstack/react-start/server";

export const getClientIP = createServerOnlyFn(() => {
  const xForwardedFor = getServerEnv().X_FORWARDED_FOR;
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
    const logger = getLogger(`ORPC ${path.join("/")}`, { path });

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
