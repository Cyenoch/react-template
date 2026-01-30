---
name: orpc
description: oRPC API guide for type-safe RPC procedures. Use when defining API endpoints, middleware, or calling the API from the client. Triggers: "orpc", "rpc procedure", "api endpoint", "middleware chain", "os.$context".
---

# oRPC Guidelines

## Core Principles

- **Implementation-First**: oRPC is implementation-first, meaning types are inferred from your code rather than defined in a separate contract.
- **End-to-End Type Safety**: Enjoy full type safety from the server implementation to the client call without code generation.
- **Middleware-Driven**: Use middleware for cross-cutting concerns like authentication, logging, and context population.

## Server Implementation

Procedures are defined in `src/core/api/routers/` and exported in the root router.

- **Root Router**: `src/core/api/router.ts:4`
- **Context Builder**: `src/core/api/context.ts:20` uses `os.$context<ServerContext>()`.
- **Base Builder**: `src/core/api/context.ts:22` applies the `appContextMiddleware`.

## Client Usage

The oRPC client is configured in `src/core/api/client.ts`.

- **Usage**:
  ```typescript
  import { orpcClient } from "@/core/api/client";
  const result = await orpcClient.auth.maybeMe();
  ```

## Best Practices

- **Use Middleware**: Chain middleware using `.use()` to handle authentication (e.g., `authMiddleware` in `src/core/api/middleware/auth.ts`).
- **Input Validation**: Use Zod schemas with `.input()` to validate request data.
- **Error Handling**: Throw descriptive errors that can be caught and handled on the client.
- **Contextual Data**: Access contextual data (like the current user or logger) from the `ctx` object in your procedures.
