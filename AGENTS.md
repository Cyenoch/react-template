# Repository Guidelines

## Project Structure & Module Organization
Core application code lives in `src/`. Use `src/routes/` for TanStack Router file-based routes, `src/components/` for reusable UI, layouts, and providers, `src/store/` for Zustand state, and `src/core/` for shared infrastructure such as env parsing, database access, schemas, and utilities. Tests currently live in `src/__tests__/`. Root config files include `vite.config.ts`, `vitest.config.ts`, `drizzle.config.ts`, and TypeScript configs.

## Build, Test, and Development Commands
Use Bun for all local workflows:

- `bun dev`: start the Vite/TanStack Start dev server on port `3000`.
- `bun build`: create a production build.
- `bun typecheck`: run TypeScript checks for app and node configs.
- `bun lint`: run `oxlint --fix` on the codebase.
- `bun format`: format files with `oxfmt`.
- `bun test`: run the Vitest suite.
- `bun db:generate` / `bun db:migrate`: generate and apply Drizzle migrations.
- `docker-compose up -d`: start the local PostgreSQL service when needed.

## Coding Style & Naming Conventions
Write TypeScript with 2-space indentation, no semicolon style, and ESM imports, matching the existing codebase. Prefer `PascalCase` for React components, `camelCase` for hooks and utilities, and descriptive route filenames such as `index.tsx` and `__root.tsx`. Keep shared UI in `src/components/ui/`, app-wide providers in `src/components/providers/`, and avoid bypassing `src/core/utils/` for common helpers. Run `bun lint` and `bun format` before opening a PR.

## Testing Guidelines
This repo uses Vitest with `happy-dom`. Name tests `*.test.ts` or `*.test.tsx`; place broad setup-style tests in `src/__tests__/` and keep feature-specific tests close to the code when practical. No coverage threshold is enforced in config, so contributors should add or update tests for new route logic, state transitions, and utility behavior. Run `bun test` locally before pushing.

## Commit & Pull Request Guidelines
Follow the commit style already used in history: Conventional Commit prefixes such as `feat:`, `fix:`, `refactor:`, `docs:`, `style:`, and `chore:` with a short imperative summary. PRs should include a concise description, linked issue when applicable, local verification steps, and screenshots or recordings for UI changes. Call out schema, environment, or migration impacts explicitly.

## Environment & Configuration Tips
Keep secrets in local env files, not in source control. Database and runtime configuration flow through `src/core/env/` and Drizzle config, so update those paths together when introducing new environment variables or database settings.
