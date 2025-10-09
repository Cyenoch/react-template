# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

The project uses Bun as the runtime and package manager. Key commands:

- `bun dev` - Start development server on port 3000
- `bun build` - Build for production
- `bun format` - Format code with Biome
- `bun lint` - Lint code with oxlint
- `bun typecheck` - Type check with TypeScript
- `bun analyzer` - Analyze bundle size
- `bun up` - Update dependencies to latest versions

## Database Commands

- `bun generate` - Generate Drizzle migrations
- `bun migrate` - Run Drizzle migrations
- `bun better-auth:generate` - Generate Better Auth schema

## Architecture Overview

This is a full-stack React application built with:

### Core Stack
- **Runtime**: Bun
- **Frontend**: React 19 + TanStack Router + TanStack Start (full-stack React framework) + oRPC
- **UI Library**: Shadcn UI
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **API**: oRPC (OpenAPI-compatible RPC framework)
- **State Management**: TanStack Query
- **Bundler**: Vite (Rolldown)

### Key Directories

- `src/routes/` - File-based routing with TanStack Router
- `src/orpc/` - API endpoints and client configuration
- `src/auth/` - Authentication setup (Better Auth)
- `src/database/` - Database schema and utilities
- `src/components/` - React components organized by type
- `src/utils/` - Shared utilities
- `src/env/` - Environment variable validation

### API Architecture

The project uses oRPC for type-safe APIs:
- Base router configured in `src/orpc/base.ts`
- Auth middleware in `src/orpc/auth/middleware.ts`
- Client setup in `src/orpc/client.ts`
- API routes served at `/api/rpc`

### Authentication Flow

- Database adapter uses Drizzle with PostgreSQL
- Auth state managed through TanStack Router context

### Build Tools

- **Vite**: Uses experimental Rolldown bundler via `rolldown-vite`
- **TypeScript**: Full type checking enabled
- **Biome**: Code formatting (linting disabled, uses oxlint instead)
- **oxlint**: Fast linting
- **Auto-imports**: Configured for React and common utilities

### Database Setup

- PostgreSQL database required
- Drizzle ORM with schema in `src/database/schema/`
- Better Auth tables auto-generated
- Connection via `DATABASE_URL` environment variable

### Development Notes

- Uses experimental Vite features and native plugins
- OpenTelemetry instrumentation configured for observability
- Docker setup available with `docker-compose.yaml`
- Icons from Iconify with unplugin-icons
- Image optimization with unplugin-imagemin
