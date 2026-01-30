# Project Cleanup & Documentation

## TL;DR

> **Quick Summary**: Remove 7 unused dependencies (with vite config cleanup), create README.md and CLAUDE.md documentation files, and document external reference URLs for LLM tools.
> 
> **Deliverables**:
> - Clean `package.json` with unused dependencies removed
> - Updated vite configs (advanced-chunks.ts, optimize-deps.ts)
> - `README.md` project documentation
> - `CLAUDE.md` LLM-focused architecture guide
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Baseline Check -> Dependency Removal -> Documentation

---

## Context

### Original Request
1. Check/remove unused dependencies
2. Write README.md documentation
3. Write CLAUDE.md documentation (for LLM)
4. Collect llms.txt URLs and Context7 library IDs for used dependencies

### Research Findings

**Project Overview**:
- TanStack Start (React 19) full-stack template
- Uses oRPC, Drizzle ORM + PostgreSQL, Better-Auth, Tailwind CSS v4
- 52 shadcn-style UI components using @base-ui/react primitives
- Build: Vite with experimental Rolldown bundler
- Runtime: Bun

**Unused Dependencies Identified**:
| Dependency | Reason Unused |
|------------|---------------|
| `framer-motion` | No imports found |
| `react-hook-form` | No imports found |
| `@hookform/resolvers` | No imports found |
| `superjson` | No imports found |
| `defu` | No imports found |
| `@fontsource-variable/inter` | No CSS/import references |
| `shadcn` | CLI tool, not runtime dependency |

**Critical Finding**: Vite config files reference some removed deps and must be updated atomically:
- `vite/advanced-chunks.ts:31-38` - framer-motion, superjson in chunk config
- `vite/optimize-deps.ts:4` - @hookform/resolvers/zod in exclude list

**Verified llms.txt URLs**:
- https://tanstack.com/llms.txt (TanStack Router/Query/Start)
- https://orm.drizzle.team/llms.txt (Drizzle ORM)
- https://better-auth.com/llms.txt (Better Auth)
- https://orpc.dev/llms.txt (oRPC)
- https://base-ui.com/llms.txt (Base UI)
- https://vite.dev/llms.txt (Vite)
- https://zod.dev/llms.txt (Zod - 404, not available)

**Verified Context7 Library IDs**:
| Library | Context7 ID | Score |
|---------|-------------|-------|
| React | `/websites/react_dev` | 91.7 |
| TanStack Router | `/websites/tanstack_router` | 82.0 |
| TanStack Query | `/websites/tanstack_query_v5` | 84.4 |
| Drizzle ORM | `/websites/rqbv2_drizzle-orm-fe_pages_dev` | 90.8 |
| Zod | `/colinhacks/zod` | 92.7 |
| Better Auth | `/llmstxt/better-auth_llms_txt` | 81.6 |
| Tailwind CSS | `/websites/v3_tailwindcss` | 85.9 |
| Vite | `/vitejs/vite` | 76.9 |

### Metis Review
**Identified Gaps** (addressed):
- Vite config cleanup required with dependency removal -> Bundled as atomic task
- Baseline verification needed before changes -> Added as Task 0
- Documentation length guardrails -> Set max lines: README 300, CLAUDE 350

---

## Work Objectives

### Core Objective
Clean up unused dependencies and create comprehensive documentation (README.md for humans, CLAUDE.md for LLMs).

### Concrete Deliverables
- Updated `package.json` (7 deps removed)
- Updated `vite/advanced-chunks.ts` (remove framer-motion, superjson refs)
- Updated `vite/optimize-deps.ts` (remove @hookform/resolvers/zod)
- New `README.md` (~250 lines, scannable project overview)
- New `CLAUDE.md` (~300 lines, architecture + patterns for LLM)

### Definition of Done
- [x] `bun run build` exits with code 0
- [x] `bun run typecheck` exits with code 0
- [x] No grep matches for removed deps in package.json
- [x] README.md exists with required sections
- [x] CLAUDE.md exists with architecture + external refs

### Must Have
- Atomic dependency removal (package.json + vite configs + bun install together)
- Build verification after dependency removal
- README.md sections: Overview, Quick Start, Scripts, Tech Stack
- CLAUDE.md sections: Architecture, Conventions, External References

### Must NOT Have (Guardrails)
- Adding new dependencies
- Refactoring vite config beyond removing dead references
- Creating additional documentation files beyond README.md and CLAUDE.md
- Modifying existing DOCKER_SETUP.md
- Documentation exceeding line limits (README: 300, CLAUDE: 350)
- Version numbers in prose (go stale quickly)

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: YES (vitest configured)
- **User wants tests**: Manual verification only (no new tests needed for this task)
- **QA approach**: Automated bash verification commands

### Automated Verification Procedures

All acceptance criteria are executable by the agent without user intervention.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
└── Task 0: Baseline verification (bun build + typecheck)

Wave 2 (After Wave 1):
└── Task 1: Remove unused dependencies (atomic: package.json + vite configs + install)

Wave 3 (After Wave 2):
├── Task 2: Write README.md
└── Task 3: Write CLAUDE.md (can run parallel with Task 2)
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 0 | None | 1 | None |
| 1 | 0 | 2, 3 | None |
| 2 | 1 | None | 3 |
| 3 | 1 | None | 2 |

---

## TODOs

- [x] 0. Verify Baseline Build

  **What to do**:
  - Run `bun run build` to ensure project builds cleanly
  - Run `bun run typecheck` to verify TypeScript compiles
  - If either fails, STOP and report before proceeding

  **Must NOT do**:
  - Fix any existing issues (out of scope)
  - Modify any files

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single verification step, no file changes
  - **Skills**: `[]`
    - No specialized skills needed for build verification

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (must complete first)
  - **Blocks**: Task 1
  - **Blocked By**: None

  **References**:
  - `package.json:5-17` - Available npm scripts (build, typecheck)

  **Acceptance Criteria**:

  ```bash
  # Agent runs:
  bun run build
  # Assert: Exit code 0

  bun run typecheck
  # Assert: Exit code 0
  ```

  **Evidence to Capture:**
  - [x] Terminal output from both commands

  **Commit**: NO

---

- [x] 1. Remove Unused Dependencies (Atomic)

  **What to do**:
  - Remove from `package.json` dependencies:
    - `framer-motion`
    - `react-hook-form`
    - `@hookform/resolvers`
    - `superjson`
    - `defu`
    - `@fontsource-variable/inter`
    - `shadcn`
  - Update `vite/advanced-chunks.ts`:
    - Remove lines 31-34 (framer-motion chunk)
    - Update line 36: change `(zod|superjson)` to just `zod`
  - Update `vite/optimize-deps.ts`:
    - Remove `@hookform/resolvers/zod` from exclude array (line 4)
  - Run `bun install` to update lockfile
  - Run `bun run build` to verify no broken imports

  **Must NOT do**:
  - Remove any dependency that has actual imports
  - Refactor vite chunk strategy beyond removing dead refs
  - Add any new dependencies

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward file edits with clear targets
  - **Skills**: `[]`
    - No specialized skills needed

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Tasks 2, 3
  - **Blocked By**: Task 0

  **References**:
  - `package.json:18-64` - dependencies and devDependencies sections
  - `vite/advanced-chunks.ts:31-38` - chunk config with framer-motion, superjson
  - `vite/optimize-deps.ts:4` - exclude list with @hookform/resolvers/zod

  **Acceptance Criteria**:

  ```bash
  # Verify deps removed from package.json
  ! grep -q '"framer-motion"' package.json && echo "PASS: framer-motion removed" || echo "FAIL"
  ! grep -q '"react-hook-form"' package.json && echo "PASS: react-hook-form removed" || echo "FAIL"
  ! grep -q '"@hookform/resolvers"' package.json && echo "PASS: @hookform/resolvers removed" || echo "FAIL"
  ! grep -q '"superjson"' package.json && echo "PASS: superjson removed" || echo "FAIL"
  ! grep -q '"defu"' package.json && echo "PASS: defu removed" || echo "FAIL"
  ! grep -q '"@fontsource-variable/inter"' package.json && echo "PASS: @fontsource removed" || echo "FAIL"
  ! grep -q '"shadcn"' package.json && echo "PASS: shadcn removed" || echo "FAIL"

  # Verify vite configs updated
  ! grep -q 'framer-motion' vite/advanced-chunks.ts && echo "PASS: framer-motion removed from chunks" || echo "FAIL"
  ! grep -q 'superjson' vite/advanced-chunks.ts && echo "PASS: superjson removed from chunks" || echo "FAIL"
  ! grep -q '@hookform/resolvers' vite/optimize-deps.ts && echo "PASS: @hookform removed from optimize" || echo "FAIL"

  # Verify project still builds
  bun run build && echo "PASS: Build successful" || echo "FAIL: Build broken"
  bun run typecheck && echo "PASS: Typecheck successful" || echo "FAIL: Typecheck broken"
  ```

  **Evidence to Capture:**
  - [x] All grep verification outputs
  - [x] Build and typecheck command outputs

  **Commit**: YES
  - Message: `chore: remove unused dependencies and update vite configs`
  - Files: `package.json`, `bun.lock`, `vite/advanced-chunks.ts`, `vite/optimize-deps.ts`
  - Pre-commit: `bun run build && bun run typecheck`

---

- [x] 2. Write README.md

  **What to do**:
  - Create `README.md` at project root
  - Follow style/tone of existing `DOCKER_SETUP.md`
  - Include sections:
    - Project title and brief description
    - Features (key tech stack highlights)
    - Quick Start (prerequisites, install, run)
    - Available Scripts (from package.json)
    - Tech Stack (with links)
    - Project Structure (high-level)
    - License
  - Keep under 300 lines, scannable format

  **Must NOT do**:
  - Exceed 300 lines
  - Include specific version numbers in prose
  - Duplicate detailed Docker info (reference DOCKER_SETUP.md instead)
  - Add badges (no CI configured)

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: Documentation writing task
  - **Skills**: `[]`
    - Standard writing, no specialized skills

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 3)
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  - `DOCKER_SETUP.md:1-50` - Style and tone reference (markdown formatting, emoji usage)
  - `package.json:5-17` - Available scripts to document
  - `package.json:18-64` - Dependencies for Tech Stack section
  - `src/` directory structure - For Project Structure section

  **Acceptance Criteria**:

  ```bash
  # Verify file exists
  test -f README.md && echo "PASS: README.md exists" || echo "FAIL"

  # Verify required sections
  grep -q "Quick Start" README.md && echo "PASS: Has Quick Start" || echo "FAIL"
  grep -q "Tech Stack" README.md && echo "PASS: Has Tech Stack" || echo "FAIL"
  grep -q "Scripts" README.md && echo "PASS: Has Scripts" || echo "FAIL"

  # Verify not over-engineered (line count)
  LINE_COUNT=$(wc -l < README.md)
  [ "$LINE_COUNT" -lt 350 ] && echo "PASS: Under 350 lines ($LINE_COUNT)" || echo "FAIL: Too long ($LINE_COUNT lines)"
  ```

  **Evidence to Capture:**
  - [x] Section grep verification outputs
  - [x] Line count output

  **Commit**: YES
  - Message: `docs: add README.md project documentation`
  - Files: `README.md`
  - Pre-commit: None (documentation only)

---

- [x] 3. Write CLAUDE.md with External References

  **What to do**:
  - Create `CLAUDE.md` at project root
  - Focus on information useful for LLM code assistants
  - Include sections:
    - Overview (what this project is)
    - Architecture (folder structure, layers)
    - Key Patterns (routing, API, auth, database)
    - Coding Conventions (naming, file organization)
    - Common Tasks (how to add routes, API endpoints, etc.)
    - External References (llms.txt URLs and Context7 IDs)
  - Keep under 350 lines
  - Focus on patterns, not specific line numbers

  **Must NOT do**:
  - Exceed 350 lines
  - Include line numbers that change frequently
  - Duplicate README.md content
  - Include unverified external references

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: Documentation writing task
  - **Skills**: `[]`
    - Standard writing, no specialized skills

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 2)
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  - `src/` directory structure - Architecture documentation
  - `src/core/api/` - oRPC API layer patterns
  - `src/core/database/` - Drizzle ORM patterns
  - `src/core/api/auth/` - Better-Auth patterns
  - `src/routes/` - TanStack Router file-based routing
  - `src/components/ui/` - shadcn-style UI component patterns

  **Verified External References to Include**:

  **llms.txt URLs**:
  - https://tanstack.com/llms.txt
  - https://orm.drizzle.team/llms.txt
  - https://better-auth.com/llms.txt
  - https://orpc.dev/llms.txt
  - https://base-ui.com/llms.txt
  - https://vite.dev/llms.txt

  **Context7 Library IDs**:
  - React: `/websites/react_dev`
  - TanStack Router: `/websites/tanstack_router`
  - TanStack Query: `/websites/tanstack_query_v5`
  - Drizzle ORM: `/websites/rqbv2_drizzle-orm-fe_pages_dev`
  - Zod: `/colinhacks/zod`
  - Better Auth: `/llmstxt/better-auth_llms_txt`
  - Tailwind CSS: `/websites/v3_tailwindcss`
  - Vite: `/vitejs/vite`

  **Acceptance Criteria**:

  ```bash
  # Verify file exists
  test -f CLAUDE.md && echo "PASS: CLAUDE.md exists" || echo "FAIL"

  # Verify required sections
  grep -q "Architecture" CLAUDE.md && echo "PASS: Has Architecture" || echo "FAIL"
  grep -q "Conventions" CLAUDE.md && echo "PASS: Has Conventions" || echo "FAIL"
  grep -q "External References" CLAUDE.md && echo "PASS: Has External References" || echo "FAIL"

  # Verify llms.txt URLs documented
  grep -q "tanstack.com/llms.txt" CLAUDE.md && echo "PASS: Has TanStack llms.txt" || echo "FAIL"
  grep -q "orm.drizzle.team/llms.txt" CLAUDE.md && echo "PASS: Has Drizzle llms.txt" || echo "FAIL"
  grep -q "better-auth.com/llms.txt" CLAUDE.md && echo "PASS: Has Better-Auth llms.txt" || echo "FAIL"

  # Verify Context7 IDs documented
  grep -q "Context7" CLAUDE.md && echo "PASS: Has Context7 section" || echo "FAIL"
  grep -q "/websites/react_dev" CLAUDE.md && echo "PASS: Has React Context7 ID" || echo "FAIL"

  # Verify not over-engineered
  LINE_COUNT=$(wc -l < CLAUDE.md)
  [ "$LINE_COUNT" -lt 400 ] && echo "PASS: Under 400 lines ($LINE_COUNT)" || echo "FAIL: Too long ($LINE_COUNT lines)"
  ```

  **Evidence to Capture:**
  - [x] Section and URL grep verification outputs
  - [x] Line count output

  **Commit**: YES
  - Message: `docs: add CLAUDE.md LLM-focused architecture guide`
  - Files: `CLAUDE.md`
  - Pre-commit: None (documentation only)

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 0 | (no commit) | - | bun build && bun typecheck |
| 1 | `chore: remove unused dependencies and update vite configs` | package.json, bun.lock, vite/*.ts | bun build && bun typecheck |
| 2 | `docs: add README.md project documentation` | README.md | file exists |
| 3 | `docs: add CLAUDE.md LLM-focused architecture guide` | CLAUDE.md | file exists |

---

## Success Criteria

### Verification Commands
```bash
# Final verification (all should pass)
bun run build           # Expected: Exit 0
bun run typecheck       # Expected: Exit 0
test -f README.md       # Expected: true
test -f CLAUDE.md       # Expected: true

# Dependency removal verification
grep -c '"framer-motion"' package.json  # Expected: 0
grep -c '"react-hook-form"' package.json  # Expected: 0
```

### Final Checklist
- [x] All 7 unused dependencies removed from package.json
- [x] Vite configs updated (no references to removed deps)
- [x] Project builds successfully
- [x] README.md exists with required sections (<300 lines)
- [x] CLAUDE.md exists with architecture + external refs (<350 lines)
- [x] All external references verified (llms.txt URLs, Context7 IDs)
