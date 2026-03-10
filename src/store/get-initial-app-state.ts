import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "@/core/utils/server-utils";
import { getTheme } from "@/core/utils/theme";
import type { AppSessionData } from "@/types/session";
import { createAuthState, defaultAppStoreState, type AppStoreSnapshot } from "./app-store";

const normalizeSession = (session: AppSessionData) => {
  return Object.keys(session).length > 0 ? session : null;
};

export const getInitialAppState = createServerFn({ method: "GET" }).handler(async () => {
  const [session, theme] = await Promise.all([useAppSession(), Promise.resolve(getTheme())]);
  const sessionData = session.data as AppSessionData;
  const appSession = normalizeSession(sessionData);

  return {
    ...defaultAppStoreState,
    auth: createAuthState(appSession),
    theme,
  } satisfies AppStoreSnapshot;
});
