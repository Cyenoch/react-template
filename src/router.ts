import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import ErrorPrint from "./components/core/error-print";
import NotFound from "./components/core/not-found";
import { createQueryClient } from "./core/utils/query-client";
import { routeTree } from "./routeTree.gen";

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

export function getRouter() {
  const queryClient = createQueryClient();

  const router = createTanStackRouter({
    routeTree,
    defaultPreload: "intent",
    defaultNotFoundComponent: NotFound,
    defaultErrorComponent: ErrorPrint,
    context: {
      queryClient,
    },
  });

  return routerWithQueryClient(router, queryClient);
}
