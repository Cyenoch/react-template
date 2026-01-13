import { orpcAuthRouter } from "./routers/auth";
import { orpcBase } from "./base";

export const orpcRootRouter = orpcBase.router({
  ...orpcAuthRouter,
});

export type AppRouter = typeof orpcRootRouter;
