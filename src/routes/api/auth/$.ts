import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/core/api/auth/server";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return auth.handler(request);
      },
      POST: async ({ request }) => {
        return auth.handler(request);
      },
    },
  },
});
