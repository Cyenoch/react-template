# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a Bun monorepo using Turborepo for task orchestration. Key commands:

```bash
bun dev          # Start all development servers
bun build        # Build all packages
bun typecheck    # Type check all packages
bun lint         # Lint all packages
bun format       # Format all packages
bun up           # Update dependencies to latest versions
```

### Database Commands

```bash
bun db:generate  # Generate Drizzle migrations
bun db:migrate   # Run Drizzle migrations
```

### Package-specific Commands

```bash
bun --cwd apps/web dev        # Run web app only
bun --cwd packages/ui build   # Build UI package only
```

## Monorepo Structure

```
react-template/
├── apps/
│   └── web/                    # TanStack Start application
│       ├── src/
│       │   ├── routes/         # File-based routing
│       │   ├── components/     # App-specific components
│       │   └── lib/            # App utilities
│       └── vite.config.ts
├── packages/
│   ├── api/                    # @workspace/api - oRPC server & client
│   │   ├── src/
│   │   │   ├── router.ts       # Root router
│   │   │   ├── client.ts       # Client setup
│   │   │   ├── middleware/     # Auth & context middleware
│   │   │   └── routers/        # API route handlers
│   │   └── package.json
│   ├── auth/                   # @workspace/auth - Better Auth
│   │   ├── src/
│   │   │   ├── server.ts       # Server-side auth
│   │   │   └── client.ts       # Client-side auth
│   │   └── package.json
│   ├── database/               # @workspace/database - Drizzle ORM
│   │   ├── src/
│   │   │   ├── client.ts       # Database client
│   │   │   └── schema/         # Database schema
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   ├── schema/                 # @workspace/schema - Zod schemas
│   │   ├── src/
│   │   │   ├── auth.ts         # Auth validation schemas
│   │   │   ├── types.ts        # Shared types
│   │   │   └── constants.ts    # Constants
│   │   └── package.json
│   ├── ui/                     # @workspace/ui - Shadcn components
│   │   ├── src/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   └── package.json
│   └── utils/                  # @workspace/utils - Shared utilities
│       ├── src/
│       │   ├── cn.ts           # className utility
│       │   ├── format.ts       # Date formatting
│       │   └── ...
│       └── package.json
├── package.json                # Root with Bun catalog
├── turbo.json                  # Turborepo config
└── tsconfig.base.json          # Shared TS config
```

## Core Stack

- **Runtime**: Bun
- **Monorepo**: Bun Workspaces + Turborepo
- **Frontend**: React 19 + TanStack Router + TanStack Start
- **UI Library**: Shadcn UI (Base UI)
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: Better Auth
- **API**: oRPC (type-safe RPC)
- **State Management**: TanStack Query
- **Bundler**: Vite (Rolldown)

## Package Dependencies

```
apps/web
  └── @workspace/api
        ├── @workspace/auth
        │     └── @workspace/database
        └── @workspace/database
  └── @workspace/ui
        └── @workspace/utils
  └── @workspace/schema
  └── @workspace/utils
```

## Bun Catalog

Common dependencies are managed via Bun catalog in root `package.json`:

```json
"catalog": {
  "typescript": "^5.8.3",
  "zod": "^4.3.5",
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  ...
}
```

Packages reference these with `"dependency": "catalog:"`.

## Key Patterns

### Imports

```typescript
// Workspace packages
import { cn } from "@workspace/utils";
import { Button } from "@workspace/ui/button";
import { auth } from "@workspace/auth/server";
import { orpcClient } from "@workspace/api/client";

// App-local imports (in apps/web)
import { MainLayout } from "@/components/layouts/main-layout";
```

### API Routes

- oRPC endpoints: `/api/rpc/*`
- Auth endpoints: `/api/auth/*`

### Adding UI Components

```bash
bunx shadcn@latest add button
```

Components are added to `packages/ui/src/`.

## Environment Variables

Required in `.env.local`:

```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000
```

## Modular Design

Packages are designed to be removable:

- **Remove API**: Delete `packages/api`, update `apps/web` routes
- **Remove Auth**: Delete `packages/auth`, remove auth middleware
- **Remove Database**: Delete `packages/database`, use different storage
- **Pure SPA**: Remove server-side packages, keep `ui`, `utils`, `schema`
