import { orpcAuthRouter } from "./routers/auth";
import { base } from "./context";

export const orpcRootRouter = base.router({
  ...orpcAuthRouter,
});

export type AppRouter = typeof orpcRootRouter;
