import { oc } from "@orpc/contract";
import type { Session, User } from "better-auth";
import { z } from "zod";

// Use z.custom for Better-Auth types to preserve type safety without duplicating schemas
const authResponseSchema = z.object({
  session: z.custom<Session>(),
  user: z.custom<User>(),
});

export const meContract = oc.output(authResponseSchema);

export const maybeMeContract = oc.output(authResponseSchema.nullable());

export const authContract = {
  me: meContract,
  maybeMe: maybeMeContract,
};
