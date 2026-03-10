import { createStore } from "zustand/vanilla";
import { setTheme as persistTheme, type Theme } from "@/core/utils/theme";
import type { AppSessionData } from "@/types/session";

export interface AuthState {
  isAuthenticated: boolean;
  session: AppSessionData | null;
}

export interface AppStoreSnapshot {
  auth: AuthState;
  theme: Theme;
}

interface AppStoreActions {
  clearSession: () => void;
  setSession: (session: AppSessionData | null) => void;
  setTheme: (theme: Theme) => void;
  syncSnapshot: (snapshot: AppStoreSnapshot) => void;
}

export type AppStore = AppStoreSnapshot & AppStoreActions;

export type AppStoreApi = ReturnType<typeof createAppStore>;

export const defaultAppStoreState: AppStoreSnapshot = {
  auth: {
    isAuthenticated: false,
    session: null,
  },
  theme: "system",
};

const getSessionUser = (session: AppSessionData | null) => {
  const user = session?.user;
  return typeof user === "object" && user !== null ? user : null;
};

export const createAuthState = (session: AppSessionData | null) => {
  return {
    isAuthenticated: getSessionUser(session) !== null,
    session,
  } satisfies AuthState;
};

export function createAppStore(initialState: AppStoreSnapshot = defaultAppStoreState) {
  return createStore<AppStore>()((set) => ({
    ...defaultAppStoreState,
    ...initialState,
    auth: createAuthState(initialState.auth.session),
    clearSession: () => {
      set({ auth: defaultAppStoreState.auth });
    },
    setSession: (session) => {
      set({ auth: createAuthState(session) });
    },
    setTheme: (theme) => {
      persistTheme(theme);
      set({ theme });
    },
    syncSnapshot: (snapshot) => {
      set({
        auth: createAuthState(snapshot.auth.session),
        theme: snapshot.theme,
      });
    },
  }));
}
