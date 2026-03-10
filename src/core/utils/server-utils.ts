import { createServerOnlyFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getServerEnv } from "../env/server-env";
import { isServer } from "@tanstack/react-query";

export const getClientIPFromRequest = createServerOnlyFn((request: Request) => {
  const serverEnv = getServerEnv();
  const xForwardedFor = serverEnv.X_FORWARDED_FOR;
  if (!!xForwardedFor || xForwardedFor === "X-Forwarded-For") {
    return request.headers.get("x-forwarded-for");
  } else if (xForwardedFor) {
    return request.headers.get(xForwardedFor);
  } else {
    return undefined;
  }
});

export const getClientIP = createServerOnlyFn(() => {
  const request = getRequest();
  return getClientIPFromRequest(request);
});

export const runServerOnly = <T extends CallableFunction>(fn: T) => {
  if (!isServer) throw new Error("runServerOnly can only be called on the server");
  return fn();
};
