import { createIsomorphicFn } from "@tanstack/react-start";
import { z } from "zod";
import { getServerEnv, ServerEnvSchema } from "./server-env";

export const ClientEnvSchema = ServerEnvSchema.pick({});

export type ClientEnv = z.output<typeof ClientEnvSchema>;

const getPublicEnv = createIsomorphicFn()
  .client((): ClientEnv => {
    return window.__INJECTED_PUBLIC_ENV__;
  })
  .server((): ClientEnv => {
    return ClientEnvSchema.parse(getServerEnv());
  });

export const publicEnv = getPublicEnv();
