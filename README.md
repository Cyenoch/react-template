# React Template

A modern full-stack React monorepo template with Bun, TanStack Start, and modular architecture.

## Tech Stack

- **Runtime**: Bun
- **Monorepo**: Bun Workspaces + Turborepo
- **Frontend**: React 19 + TanStack Router + TanStack Start
- **UI**: Shadcn UI (Base UI) + Tailwind CSS v4
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Better Auth
- **API**: oRPC (type-safe RPC)
- **Bundler**: Vite (Rolldown)

## Quick Start

```bash
# Install dependencies
bun install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your database credentials

# Run database migrations
bun db:migrate

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── apps/
│   └── web/                 # TanStack Start app
├── packages/
│   ├── api/                 # oRPC server & client
│   ├── auth/                # Better Auth
│   ├── database/            # Drizzle ORM
│   ├── schema/              # Zod schemas & types
│   ├── ui/                  # Shadcn components
│   └── utils/               # Shared utilities
├── package.json             # Bun catalog
└── turbo.json               # Turborepo config
```

## Commands

```bash
bun dev          # Start dev server
bun build        # Build for production
bun typecheck    # Type check
bun lint         # Lint code
bun format       # Format code

bun db:generate  # Generate migrations
bun db:migrate   # Run migrations
```

## Packages

| Package | Description |
|---------|-------------|
| `@workspace/api` | oRPC router, middleware, client |
| `@workspace/auth` | Better Auth server & client |
| `@workspace/database` | Drizzle client & schema |
| `@workspace/schema` | Zod validation schemas |
| `@workspace/ui` | Shadcn UI components |
| `@workspace/utils` | Shared utilities (cn, format, etc.) |

## Adding UI Components

```bash
bunx shadcn@latest add button
```

## Environment Variables

Create `.env.local` in the **root directory** (not in apps/web):

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
```

The monorepo is configured to load environment variables from the root.

## Docker

```bash
docker-compose up -d  # Start PostgreSQL
```

## License

MIT
