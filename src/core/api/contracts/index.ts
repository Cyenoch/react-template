import { oc } from "@orpc/contract";
import { authContract } from "./auth";
import { ClientEnvSchema } from "@/core/env";

export const contract = {
  auth: authContract,
  clientEnv: oc.output(ClientEnvSchema),
};

export type Contract = typeof contract;
