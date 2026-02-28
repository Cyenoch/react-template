import { authRouter } from "./routers/auth";
import { base } from "./context";
import { getClientEnv } from "../env/client-env";

export const orpcRootRouter = base.router({
  auth: authRouter,
  clientEnv: base.clientEnv.handler(getClientEnv),
});

export type AppRouter = typeof orpcRootRouter;
