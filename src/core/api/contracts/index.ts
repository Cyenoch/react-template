import { authContract } from "./auth";

export const contract = {
  auth: authContract,
};

export type Contract = typeof contract;
