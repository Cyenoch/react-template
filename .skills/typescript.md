---
name: typescript
description: TypeScript code style and optimization guidelines for this project. Use when writing TypeScript code (.ts, .tsx files), reviewing code quality, or implementing type-safe patterns. Triggers: "typescript", "type safety", "zod schema", "path alias", "type export".
---

# TypeScript Guidelines

## Core Principles

- **Strict Type Safety**: Avoid `any` at all costs. Use `unknown` if the type is truly unknown.
- **Zod for Validation**: Use Zod schemas for all data validation, especially at boundaries (API, Database, Forms).
- **Path Aliases**: Always use the `@/` alias for `src/` imports to maintain clean and portable import paths.

## Shared Schemas and Types

Shared Zod schemas and inferred types are located in `src/core/schema/`.

- **Zod Schemas**: `src/core/schema/index.ts`
- **Type Exports**: `src/core/schema/types.ts`

## Database Type Exports

Common database-related types are exported from `src/core/database/client.ts`:

- `SQLClient`: `src/core/database/client.ts:47`
- `DrizzleInstance`: `src/core/database/client.ts:48`
- `Transaction`: `src/core/database/client.ts:49`

## Best Practices

- **Prefer Interfaces for Objects**: Use `interface` for object shapes that might be extended, and `type` for unions or aliases.
- **Explicit Return Types**: Provide explicit return types for exported functions to improve readability and catch type mismatches early.
- **Const Assertions**: Use `as const` for literal values that should be treated as read-only constants.
