import { authRouter } from "./routers/auth";
import { base } from "./context";

export const orpcRootRouter = base.router({
  auth: authRouter,
});

export type AppRouter = typeof orpcRootRouter;
