# CLAUDE.md

## Important Notes

- Keep the documentation up to date.

## Overview

This project is a full-stack React 19 template built with TanStack Start, featuring a modular architecture designed for scalability and type safety. It uses Bun as the runtime and package manager, and Vite (via Rolldown) as the bundler.

## Architecture

The codebase follows a layered architecture centered around the `src/` directory:

- `src/core/`: Core business logic, infrastructure, and utilities.
  - `api/`: oRPC procedures, routers, and middleware.
  - `database/`: Drizzle ORM schema, migrations, and client.
  - `auth/`: Better-Auth server and client configuration.
  - `schema/`: Shared Zod validation schemas and types.
  - `env/`: Environment variable management (client-env, server-env).
  - `utils/`: Utility functions (cn, formatting, theme, query-client, trace, server-utils).
- `src/routes/`: File-based routing using TanStack Router.
- `src/components/`: UI components.
  - `ui/`: Atomic shadcn-style components using @base-ui/react.
  - `layouts/`: Page layout components.
- `src/hooks/`: Custom React hooks.

### Design Principles

- **`core/` Directory**: Contains all core business logic, infrastructure, and utilities that form the foundation of the application.
- **Environment Variables**: Centralized configuration in `core/env/`:
  - `client-env.ts`: Client-side variables (Vite `import.meta.env`).
  - `server-env.ts`: All server-side configuration (DATABASE_URL, BETTER_AUTH_SECRET, LOG_LEVEL, X_FORWARDED_FOR, OTEL_*, etc.).
- **Logging**: Unified logger in `core/utils/logger.ts`:
  - `rootLogger`: Base Pino logger instance with environment-based configuration.
  - `getLogger(module)`: Creates child loggers with module context.
  - All logging should use this centralized logger to avoid duplicate instances.

## Key Patterns

### Routing (TanStack Router)

- File-based routing in `src/routes/`.
- Use `createRootRouteWithContext` for global context (auth, theme, queryClient).
- Use `beforeLoad` for data prefetching and route guards.

### API (oRPC)

- Type-safe RPC procedures defined in `src/core/api/routers/`.
- Procedures use `base.use()` for middleware (e.g., `authMiddleware`).
- Client access via `orpcClient` from `@/core/api/client`.

### Database (Drizzle ORM)

- Schema definitions in `src/core/database/schema/`.
- Use `relations` for defining table associations.
- Access database via `getDrizzleInstance()` from `@/core/database`.

### Authentication (Better-Auth)

- Server-side config in `src/core/api/auth/server.ts`.
- Client-side config in `src/core/api/auth/client.ts`.
- Integrated with oRPC via `authMiddleware`.

### UI Components

- Built with Tailwind CSS v4 and @base-ui/react.
- Located in `src/components/ui/`.
- Follow shadcn/ui patterns for composition and customization.

## Coding Conventions

- **Naming**: Kebab-case for files/directories, PascalCase for React components.
- **Imports**: Always use the `@/` alias for `src/` imports.
- **Type Safety**: Prefer Zod schemas for validation and type inference.
- **State Management**: Use TanStack Query for server state and URL for UI state.

## Development Commands

- `bun dev`: Start development server (port 3000).
- `bun run build`: Build for production.
- `bun run typecheck`: Run TypeScript type checking (using `@typescript/native-preview tsgo`).
- `bun run lint`: Lint code using oxlint.
- `bun run format`: Format code using oxfmt.
- `bun run db:generate`: Generate Drizzle migrations.
- `bun run db:migrate`: Run Drizzle migrations.
- `bun run auth:migrate`: Run Better-Auth migrations.
- `bun run test`: Run tests with Vitest.

## Common Tasks

- **Add a Route**: Create a new `.tsx` file in `src/routes/`.
- **Add an API Endpoint**: Define a procedure in `src/core/api/routers/` and export it in `orpcRootRouter`.
- **Add a UI Component**: Run `bunx shadcn@latest add <component-name>`.

## External References

### Documentation (llms.txt)

- TanStack: https://tanstack.com/llms.txt
- Drizzle ORM: https://orm.drizzle.team/llms.txt
- Better Auth: https://better-auth.com/llms.txt
- oRPC: https://orpc.dev/llms.txt
- Base UI: https://base-ui.com/llms.txt
- Shadcn UI: https://ui.shadcn.com/llms.txt (https://ui.shadcn.com/docs/components/base/** instead of https://ui.shadcn.com/docs/components/radix/**)
- Vite: https://vite.dev/llms.txt

### Context7 Library IDs

- React: `/websites/react_dev`
- TanStack Router: `/websites/tanstack_router`
- TanStack Query: `/websites/tanstack_query_v5`
- Drizzle ORM: `/websites/rqbv2_drizzle-orm-fe_pages_dev`
- Zod: `/colinhacks/zod`
- Better Auth: `/llmstxt/better-auth_llms_txt`
- Tailwind CSS: `/websites/v3_tailwindcss`
- Vite: `/vitejs/vite`
