import { ClientEnv } from "@/core/env/client-env";

declare global {
  interface Window {
    __INJECTED_PUBLIC_ENV__: ClientEnv;
  }
}

export {};
