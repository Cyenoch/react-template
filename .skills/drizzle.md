---
name: drizzle
description: Drizzle ORM schema and database guide for this project. Use when working with database schemas (src/core/database/schema/*), defining tables, creating migrations, or database model code. Triggers: "drizzle", "pgTable", "relations", "getDrizzleInstance", "database schema".
---

# Drizzle ORM Guidelines

## Core Principles

- **Type-Safe Queries**: Always use the Drizzle instance for type-safe database interactions.
- **Schema-First**: Define all tables and relations in `src/core/database/schema/`.
- **Relations API**: Use Drizzle's `relations` API for defining table associations to enable powerful relational queries.

## Database Instance

The database instance is managed as a singleton and can be accessed via `getDrizzleInstance()`.

- **Location**: `src/core/database/client.ts:39`
- **Usage**:
  ```typescript
  import { getDrizzleInstance } from "@/core/database";
  const db = getDrizzleInstance();
  ```

## Schema Definitions

Schemas are located in `src/core/database/schema/`.

- **Better-Auth Tables**: `src/core/database/schema/better-auth.ts`
- **Table Definitions**: Use `pgTable` from `drizzle-orm/pg-core`.
- **Relations**: Use `relations` from `drizzle-orm` to define associations (e.g., `userRelations` at `src/core/database/schema/better-auth.ts:76`).

## Best Practices

- **Naming Conventions**: Use camelCase for TypeScript property names and snake_case for database column names.
- **Migrations**: Use `bun db:generate` to create migrations and `bun db:migrate` to apply them.
- **Transactions**: Use the `db.transaction()` method for atomic operations. The `Transaction` type is exported from `src/core/database/client.ts:49`.
- **Custom Logger**: The project uses a custom logger for database operations, configured in `src/core/database/logger.ts`.
