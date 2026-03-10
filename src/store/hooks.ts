import { useAppStore } from "./app-store-provider";

export function useAuthState() {
  return useAppStore((state) => state.auth);
}

export function useThemeState() {
  return useAppStore((state) => state.theme);
}

export function useSetSession() {
  return useAppStore((state) => state.setSession);
}

export function useClearSession() {
  return useAppStore((state) => state.clearSession);
}

export function useSetThemeState() {
  return useAppStore((state) => state.setTheme);
}
