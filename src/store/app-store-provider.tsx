import { createContext, useContext, useEffect, useRef, type PropsWithChildren } from "react";
import { useStore } from "zustand";
import {
  createAppStore,
  type AppStore,
  type AppStoreApi,
  type AppStoreSnapshot,
} from "./app-store";
import { applyTheme, subscribeToSystemTheme } from "@/core/utils";

const AppStoreContext = createContext<AppStoreApi | null>(null);

interface AppStoreProviderProps extends PropsWithChildren {
  initialState: AppStoreSnapshot;
}

function AppStoreEffects() {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    applyTheme(theme);

    if (theme !== "system") {
      return;
    }

    return subscribeToSystemTheme(() => {
      applyTheme("system");
    });
  }, [theme]);

  return null;
}

export function AppStoreProvider({ children, initialState }: AppStoreProviderProps) {
  const storeRef = useRef<AppStoreApi | null>(null);

  if (!storeRef.current) {
    storeRef.current = createAppStore(initialState);
  }

  useEffect(() => {
    storeRef.current?.getState().syncSnapshot(initialState);
  }, [initialState]);

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      <AppStoreEffects />
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore<T>(selector: (state: AppStore) => T) {
  const store = useContext(AppStoreContext);

  if (!store) {
    throw new Error("useAppStore must be used within AppStoreProvider");
  }

  return useStore(store, selector);
}
