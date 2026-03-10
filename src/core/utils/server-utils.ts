import { createServerOnlyFn } from "@tanstack/react-start";
import { getRequest, useSession } from "@tanstack/react-start/server";
import { getServerEnv } from "../env/server-env";
import { isServer } from "@tanstack/react-query";
import type { AppSessionData } from "@/types/session";

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

export const useAppSession = createServerOnlyFn(() => {
  const session = useSession<AppSessionData>({
    name: "app-session",
    password: getServerEnv().SESSION_SECRET,
    cookie: {
      path: "/",
      secure: !import.meta.env.DEV,
      sameSite: "lax",
      httpOnly: true,
    },
  });
  return session;
});
