# Project Documentation Learnings

- **Project Structure**: The project is a modular monolith, not a monorepo. Core logic is located in `src/core/` (api, database, schema, shared).
- **Tech Stack**: Uses React 19, TanStack Start, Bun, oRPC, and Drizzle ORM.
- **Tooling**: Uses `oxlint` for linting and `oxfmt` for formatting.
- **Bundler**: Uses Vite with Rolldown (`npm:rolldown-vite@latest`).
- **Documentation**: `AGENTS.md` (and `CLAUDE.md`) previously contained outdated monorepo structure information. The new `README.md` reflects the actual single-package structure.

## CLAUDE.md Creation
- Created LLM-focused architecture documentation.
- Verified project structure: Single-package structure with core logic in `src/core/`.
- Identified key patterns: TanStack Router (file-based), oRPC (type-safe API), Drizzle ORM (PostgreSQL), Better-Auth.
- UI components (52 total) are built with Tailwind CSS v4 and @base-ui/react.
- Vite is configured to use Rolldown (`rolldown-vite`).
- Documentation includes verified llms.txt URLs and Context7 library IDs.

## Task Completion Summary

### Task 0: Verify Baseline Build ✅
**Completed**: 2026-01-30
- Build: PASS (exit code 0)
- Typecheck: PASS (exit code 0)
- Output: 19.8 MB total, 5.84 MB gzip
- No existing issues found

### Task 1: Remove Unused Dependencies (Atomic) ✅
**Completed**: 2026-01-30
**Removed 7 dependencies**:
1. `framer-motion` (^12.26.1) - No runtime imports
2. `react-hook-form` (^7.71.0) - No runtime imports
3. `@hookform/resolvers` (^5.2.2) - Only in vite optimize exclude
4. `superjson` (^2.2.6) - Only in vite chunk config
5. `defu` (^6.1.4) - No runtime imports
6. `@fontsource-variable/inter` (^5.2.8) - No CSS/font imports
7. `shadcn` (^3.6.3) - CLI tool only

**Vite Config Updates**:
- `vite/advanced-chunks.ts`: Removed framer-motion chunk group, updated validation chunk (removed superjson)
- `vite/optimize-deps.ts`: Removed @hookform/resolvers/zod from exclude array

**Verification**: bun install successful (33 packages, 7 removed), build passes

### Task 2: Write README.md ✅
**Completed**: 2026-01-30
**File**: 119 lines
**Sections**: Overview, Features, Quick Start, Tech Stack, Project Structure, Development Commands, Environment Variables, License

**Key Content**:
- Project title: React Template
- Description: Modern full-stack React template with Bun, TanStack Start, oRPC
- Features: React 19, TanStack Start, Bun, oRPC, Drizzle ORM, Better Auth, Tailwind CSS v4, Shadcn UI
- Quick Start: Prerequisites, Installation, Database Setup, Development
- Tech Stack table with links
- Project structure tree showing src/core/ organization
- All bun scripts documented

### Task 3: Write CLAUDE.md ✅
**Completed**: 2026-01-30
**File**: 90 lines
**Sections**: Overview, Architecture, Key Patterns, Coding Conventions, Development Commands, Common Tasks, External References

**Key Content**:
- Architecture: src/core/ (api, database, auth, schema, shared), src/routes/, src/components/
- Patterns: TanStack Router (file-based), oRPC (type-safe), Drizzle ORM, Better-Auth, UI components
- Conventions: Kebab-case files, PascalCase components, @/ alias imports, Zod validation
- Common Tasks: Add route, Add API endpoint, Add UI component
- External References: All 6 llms.txt URLs and 8 Context7 IDs documented

## Verified External References

### llms.txt URLs
- ✅ https://tanstack.com/llms.txt
- ✅ https://orm.drizzle.team/llms.txt
- ✅ https://better-auth.com/llms.txt
- ✅ https://orpc.dev/llms.txt
- ✅ https://base-ui.com/llms.txt
- ✅ https://vite.dev/llms.txt

### Context7 Library IDs
- ✅ React: `/websites/react_dev` (Score: 91.7)
- ✅ TanStack Router: `/websites/tanstack_router` (Score: 82.0)
- ✅ TanStack Query: `/websites/tanstack_query_v5` (Score: 84.4)
- ✅ Drizzle ORM: `/websites/rqbv2_drizzle-orm-fe_pages_dev` (Score: 90.8)
- ✅ Zod: `/colinhacks/zod` (Score: 92.7)
- ✅ Better Auth: `/llmstxt/better-auth_llms_txt` (Score: 81.6)
- ✅ Tailwind CSS: `/websites/v3_tailwindcss` (Score: 85.9)
- ✅ Vite: `/vitejs/vite` (Score: 76.9)

## Commits
1. `f426c57` - chore: remove unused dependencies and update vite configs
2. `8e59c4a` - docs: add README.md and CLAUDE.md documentation

## Final Status
- ✅ All 15 checkboxes marked complete
- ✅ All 4 main tasks finished
- ✅ 2 commits made
- ✅ 6 files modified
- ✅ Build and typecheck passing
