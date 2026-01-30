---
name: better-auth
description: Better-Auth authentication guide for server and client. Use when managing user sessions, authentication flows, or protected routes. Triggers: "better-auth", "authentication", "session", "auth middleware", "sign in".
---

# Better-Auth Guidelines

## Core Principles

- **Unified Auth**: Better-Auth provides a consistent API for both server-side and client-side authentication.
- **Drizzle Integration**: Uses the `drizzleAdapter` to store user, session, and account data in the database.
- **Middleware Integration**: Integrated with oRPC via `authMiddleware` to protect API endpoints.

## Server Configuration

The server-side configuration is located in `src/core/api/auth/server.ts`.

- **Auth Instance**: `src/core/api/auth/server.ts:5`
- **Database Adapter**: Uses `drizzleAdapter` with the instance from `getDrizzleInstance()`.

## Client Configuration

The client-side configuration is located in `src/core/api/auth/client.ts`.

- **Usage**:
  ```typescript
  import { authClient } from "@/core/api/auth/client";
  await authClient.signIn.email({ email, password });
  ```

## Best Practices

- **Session Access**: Access the current session in TanStack Router's `beforeLoad` (see `src/routes/__root.tsx:41`).
- **Protected Routes**: Use `beforeLoad` to redirect unauthenticated users away from protected pages.
- **API Protection**: Use `authMiddleware` (in `src/core/api/middleware/auth.ts`) for oRPC procedures that require authentication.
- **Schema**: Ensure the database schema in `src/core/database/schema/better-auth.ts` matches the Better-Auth requirements.
