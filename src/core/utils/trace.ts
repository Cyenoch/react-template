import { SpanKind, SpanStatusCode, trace } from "@opentelemetry/api";
import { createServerOnlyFn } from "@tanstack/react-start";
import { getServerEnv } from "../env/server-env";
import { getClientIPFromRequest } from "./server-utils";

export const getTracer = createServerOnlyFn(() => {
  const serverEnv = getServerEnv();
  return trace.getTracer(serverEnv.OTEL_SERVICE_NAME ?? "Server");
});

export const getSpanAttributesFromRequest = createServerOnlyFn((request: Request) => {
  const uri = new URL(request.url);
  return {
    "http.method": request.method,
    "http.url": uri.pathname,
    "http.search": uri.search,
    "http.host": uri.host,
    "http.protocol": uri.protocol,
    "http.user_agent": request.headers.get("user-agent") ?? undefined,
    "http.referer": request.headers.get("referer") ?? undefined,
    "http.scheme": uri.protocol.replace(":", ""), // http/https
    "http.request_content_length": request.headers.get("content-length") ?? undefined,
    "http.request_id": request.headers.get("x-request-id") ?? undefined,
    "http.accept_encoding": request.headers.get("accept-encoding") ?? undefined,
    "http.accept_language": request.headers.get("accept-language") ?? undefined,
    "http.origin": request.headers.get("origin") ?? undefined,
    "net.peer.ip": getClientIPFromRequest(request) ?? undefined,
    "net.host.name": uri.hostname,
    "net.host.port": uri.port || (uri.protocol === "https:" ? "443" : "80"),
  };
});

export const getSpanAttributesFromResponse = createServerOnlyFn((response: Response) => {
  return {
    "http.status_code": response.status,
    "http.response.size": response.headers.get("content-length") || 0,
    "http.response_content_type": response.headers.get("content-type") ?? undefined,
    "http.cache_control": response.headers.get("cache-control") ?? undefined,
    "http.etag": response.headers.get("etag") ?? undefined,
    "http.response_encoding": response.headers.get("content-encoding") ?? undefined,
    "http.response_language": response.headers.get("content-language") ?? undefined,
  };
});

export const traceFetch = createServerOnlyFn(
  (handler: (request: Request) => Promise<Response> | Response) => {
    return (request: Request) => {
      const tracer = getTracer();
      const uri = new URL(request.url);

      return tracer.startActiveSpan(
        `Request ${uri.pathname}`,
        {
          kind: SpanKind.SERVER,
          attributes: getSpanAttributesFromRequest(request),
        },
        async (span) => {
          try {
            const response = await handler(request);

            span.setAttributes(getSpanAttributesFromResponse(response));

            return response;
          } catch (error: any) {
            span.recordException(error);
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: error.message,
            });
            throw error;
          } finally {
            span.end();
          }
        },
      );
    };
  },
);

export const runWithSpan = createServerOnlyFn(
  <Args extends any[], R>(
    fn: (...args: Args) => R,
    options?: {
      name?: string;
      attributes?: Record<string, any>;
    },
  ) => {
    return (...args: Args): R => {
      const tracer = getTracer();
      const spanName = options?.name ?? fn.name ?? "anonymous";
      const attributes = options?.attributes ?? {};

      return tracer.startActiveSpan(
        spanName,
        { kind: SpanKind.SERVER, attributes },
        async (span) => {
          try {
            return await fn(...args);
          } catch (error: any) {
            span.recordException(error);
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: error?.message ?? error?.toString() ?? "Unknown error",
            });
            throw error;
          } finally {
            span.end();
          }
        },
      ) as R;
    };
  },
);
